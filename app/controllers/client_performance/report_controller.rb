# frozen_string_literal: true

class ClientPerformance::ReportController < ApplicationController
  requires_plugin ClientPerformance::PLUGIN_NAME

  skip_before_action :verify_authenticity_token,
                     :check_xhr,
                     :preload_json,
                     :redirect_to_login_if_required
  before_action :skip_persist_session

  NUMERIC_FIELDS = %w[
    time_to_first_byte
    discourse_init
    discourse_paint
    dom_content_loaded
    first_contentful_paint
    largest_contentful_paint
    interaction_next_paint
    cumulative_layout_shift
  ]

  ASSET_FIELDS = %w[local app_cdn s3_cdn]

  JSON_SCHEMA = {
    "type" => "object",
    "required" => %w[path time_to_first_byte assets],
    "properties" => {
      "path" => {
        "type" => "string",
      },
      **NUMERIC_FIELDS.map { |f| [f, { "type" => "number" }] }.to_h,
      "interaction_next_paint_target" => {
        "type" => "string",
      },
      "cumulative_layout_shift_target" => {
        "type" => "string",
      },
      "viewport_width" => {
        "type" => "integer",
      },
      "viewport_height" => {
        "type" => "integer",
      },
      "mobile_view" => {
        "type" => "boolean",
      },
      "assets" => {
        "type" => "object",
        "properties" => {
          **ASSET_FIELDS
            .map do |k|
              [
                k,
                {
                  "type" => "object",
                  "properties" => {
                    "success_count" => {
                      "type" => "integer",
                    },
                    "fail_count" => {
                      "type" => "integer",
                    },
                    "pending_count" => {
                      "type" => "integer",
                    },
                    "max_duration" => {
                      "type" => "number",
                    },
                    "domain" => {
                      "type" => "string",
                    },
                  },
                  "additionalProperties" => false,
                },
              ]
            end
            .to_h,
        },
        "additionalProperties" => false,
      },
    },
    "additionalProperties" => false,
  }

  LOGS_PER_10_SECONDS = 2

  def report
    RateLimiter.new(
      nil,
      "client_performance_report_#{current_user&.id || request.client_ip}",
      LOGS_PER_10_SECONDS,
      10,
    ).performed!

    begin
      reported_data = JSON.parse(params.require("data"))
    rescue JSON::ParserError
      raise Discourse::InvalidParameters.new("Cannot parse JSON")
    end

    if !JSONSchemer.schema(JSON_SCHEMA).valid?(reported_data)
      raise Discourse::InvalidParameters.new("Unexpected JSON structure")
    end

    data = {}

    data["@timestamp"] = Time.now.iso8601
    data["type"] = "client-performance"

    path = reported_data["path"]
    data["url"] = { "domain" => Discourse.current_hostname, "path" => path }

    route =
      begin
        Rails.application.routes.recognize_path(path)
      rescue ActionController::RoutingError
        nil
      end

    data["discourse"] = {}

    data["discourse"]["route"] = "#{route[:controller]}/#{route[:action]}" if route

    if current_user
      data["discourse"]["user"] = {
        "name" => current_user.username,
        "staff" => current_user.staff?,
      }
    end

    data["user_agent"] = { "original" => request.user_agent }
    data["source"] = { "address" => request.remote_ip }

    data["discourse"]["client_perf"] = { "after_ttfb" => {} }

    ttfb = reported_data["time_to_first_byte"]

    NUMERIC_FIELDS.each do |f|
      if raw = reported_data[f]
        value = raw.to_f
        value = value / 1000 unless f == "cumulative_layout_shift"
        data["discourse"]["client_perf"][f] = value.round(3)
        if !%w[time_to_first_byte interaction_next_paint cumulative_layout_shift].include?(f)
          data["discourse"]["client_perf"]["after_ttfb"][f] = ((raw - ttfb).to_f / 1000).round(3)
        end
      end
    end

    data["discourse"]["client_perf"]["interaction_next_paint_target"] = reported_data[
      "interaction_next_paint_target"
    ]

    data["discourse"]["client_perf"]["cumulative_layout_shift_target"] = reported_data[
      "cumulative_layout_shift_target"
    ]

    data["discourse"]["asset_perf"] = reported_data["assets"]

    data["discourse"]["client_info"] = {
      "viewport_height" => reported_data["viewport_height"],
      "viewport_width" => reported_data["viewport_width"],
      "mobile_view" => reported_data["mobile_view"],
    }

    log(data)

    render plain: "report submitted"
  rescue RateLimiter::LimitExceeded
    render plain: "too many reports submitted recently, skipping this one"
  end

  private

  def log(data)
    self.class.raw_log("#{data.to_json}\n")
  end

  def self.raw_log(message)
    @@logger ||=
      begin
        f = File.open "#{Rails.root}/log/client-performance.log", "a"
        f.sync = true
        Logger.new f
      end

    @@log_queue ||= Queue.new

    if !defined?(@@log_thread) || !@@log_thread.alive?
      @@log_thread =
        Thread.new do
          loop do
            @@logger << @@log_queue.pop
          rescue Exception => e
            Discourse.warn_exception(
              e,
              message: "Exception encountered while logging client performance",
            )
          end
        end
    end

    @@log_queue.push(message)
  end

  private

  def skip_persist_session
    # This endpoint is called asynchronously at the same time as other requests,
    # and never needs to modify the session. Skipping ensures that an unneeded cookie rotation
    # doesn't race against another request and cause issues.
    session.options[:skip] = true
  end
end
