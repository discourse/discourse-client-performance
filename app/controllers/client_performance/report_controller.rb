# frozen_string_literal: true

class ClientPerformance::ReportController < ApplicationController
  skip_before_action :verify_authenticity_token, :check_xhr, :preload_json

  NUMERIC_FIELDS = %w[
    time_to_first_byte
    discourse_booted
    dom_content_loaded
    first_contentful_paint
    largest_contentful_paint
    interaction_next_paint
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

    path = data["path"]
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
        data["discourse"]["client_perf"][f] = (raw.to_f / 1000).round(3)
        if !%w[time_to_first_byte interaction_next_paint].include?(f)
          data["discourse"]["client_perf"]["after_ttfb"][f] = ((raw - ttfb).to_f / 1000).round(3)
        end
      end
    end

    data["discourse"]["asset_perf"] = reported_data["assets"]

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
end
