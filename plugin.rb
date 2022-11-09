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
end

register_html_builder('server:before-head-close') do |controller|
  "<script async src=#{::ClientPerformance::SCRIPT_PATH}></script>"
end

# TODO: this is not going to work until core learns how to handle
# paths. This is too early for site settings to be accessed, so we don't know what domain we
# are on.
# extend_content_security_policy(
#  script_src: [::ClientPerformance::SCRIPT_PATH]
# )

require_relative 'lib/engine'

after_initialize do

  Discourse::Application.routes.append do
    mount ::ClientPerformance::Engine, at: "/client-performance"
  end

  ClientPerformance::Engine.routes.append do
    post "report" => "report#report"
  end

end
