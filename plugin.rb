# frozen_string_literal: true

# name: discourse-client-performance
# about: Tools for measuring client-side performance and reporting to the server
# version: 1.0
# author: Discourse
# url: https://github.com/discourse/discourse-client-performance
# transpile_js: true

enabled_site_setting :client_performance_enabled

register_html_builder('server:before-head-close') do |controller|
  src = "#{Discourse.base_path}/plugins/discourse-client-performance/javascripts/discourse-client-performance.js"
  "<script async src=#{src}></script>"
end

module ::ClientPerformance
  PLUGIN_NAME = "client-performance"
end

require_relative 'lib/engine'

after_initialize do

  Discourse::Application.routes.append do
    mount ::ClientPerformance::Engine, at: "/client-performance"
  end

  ClientPerformance::Engine.routes.append do
    post "report" => "report#report"
  end

end
