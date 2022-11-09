# frozen_string_literal: true

# name: discourse-client-performance
# about: Tools for measuring client-side performance and reporting to the server
# version: 1.0
# author: Discourse
# url: https://github.com/discourse/discourse-client-performance
# transpile_js: true

enabled_site_setting :client_performance_enabled

module ::ClientPerformance
  PLUGIN_NAME = "client-performance"
  SCRIPT_PATH = "#{Discourse.base_path}/plugins/discourse-client-performance/javascripts/discourse-client-performance.js"
  SCRIPT_HASH = Digest::SHA256.hexdigest(File.read("#{Rails.root}/plugins/discourse-client-performance/public/javascripts/discourse-client-performance.js"))
end

register_html_builder('server:before-head-close') do |controller|
  path = ClientPerformance::SCRIPT_PATH
  path += "?v=#{ClientPerformance::SCRIPT_HASH}" if Rails.env.production?
  "<script async src=\"#{path}\"></script>"
end

require_relative 'lib/engine'

after_initialize do
  if Rails.configuration.multisite
    raise "discourse-client-performance does not support multisite environments. Uninstall the plugin."
  end

  extend_content_security_policy(
    script_src: ["#{Discourse.base_url_no_prefix}#{::ClientPerformance::SCRIPT_PATH}"]
  )

  Discourse::Application.routes.append do
    mount ::ClientPerformance::Engine, at: "/client-performance"
  end

  ClientPerformance::Engine.routes.append do
    post "report" => "report#report"
  end

end
