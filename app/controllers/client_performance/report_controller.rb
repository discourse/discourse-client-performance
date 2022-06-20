# frozen_string_literal: true

class ClientPerformance::ReportController < ApplicationController
  skip_before_action :verify_authenticity_token, :check_xhr, :preload_json

  NUMERIC_FIELDS = [
    "time_to_first_byte",
    "discourse_booted",
    "dom_content_loaded",
    "first_contentful_paint",
    "largest_contentful_paint",
  ]

  def report
    RateLimiter.new(nil, "client_performance_report_#{current_user&.id || request.client_ip}", 1, 1.minute).performed!

    data = {}

    data["url.path"] = path = params["path"].to_s

    route = begin
      Rails.application.routes.recognize_path(path)
    rescue ActionController::RoutingError
      nil
    end

    if route
      data["discourse.route"] = "#{route[:controller]}/#{route[:action]}"
    end

    if current_user
      data["discourse.user.name"] = current_user.username
      data["discourse.user.staff"] = current_user.staff?
    end

    data["user_agent.original"] = request.user_agent
    data["source.ip"] = request.remote_ip

    NUMERIC_FIELDS.each do |f|
      if (raw = params[f]) && (raw.is_a?(String) || raw.is_a?(Integer))
        data["discourse.client_perf.#{f}"] = raw.to_i
      else
        raise Discourse::InvalidParameters.new(f)
      end
    end

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
    @@logger ||= begin
      f = File.open "#{Rails.root}/log/client-performance.log", "a"
      f.sync = true
      Logger.new f
    end
    @@log_queue ||= Queue.new
    @@log_thread ||= Thread.new do
      begin
        loop { @@logger << @@log_queue.pop }
      rescue Exception => e
        Discourse.warn_exception(e, message: "Client performance logging logging thread terminated unexpectedly")
      end
    end
    @@log_queue.push(message)
  end
end
