# frozen_string_literal: true

# name: discourse-client-performance
# about: Tools for measuring client-side performance and reporting to the server
# version: 1.0
# author: Discourse
# url: https://github.com/discourse/discourse-client-performance

enabled_site_setting :client_performance_enabled

module ::ClientPerformance
  PLUGIN_NAME = "discourse-client-performance"
  SCRIPT_PATH = "/plugins/#{PLUGIN_NAME}/javascripts/discourse-client-performance.js"
  SCRIPT_HASH =
    Digest::SHA256.hexdigest(
      File.read(
        "#{Rails.root}/plugins/#{PLUGIN_NAME}/public/javascripts/discourse-client-performance.js",
      ),
    )
end

register_html_builder("server:before-head-close") do |controller|
  path = ClientPerformance::SCRIPT_PATH
  path += "?v=#{ClientPerformance::SCRIPT_HASH}" if Rails.env.production?
  "<script async src=\"#{Discourse.base_path}#{path}\" nonce=\"#{controller.helpers.try(:csp_nonce_placeholder)}\"></script>"
end

require_relative "lib/engine"

after_initialize do
  extend_content_security_policy(script_src: [::ClientPerformance::SCRIPT_PATH])

  Discourse::Application.routes.append do
    mount ::ClientPerformance::Engine, at: "/client-performance"
  end

  ClientPerformance::Engine.routes.append { post "report" => "report#report" }
end
