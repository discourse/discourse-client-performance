# frozen_string_literal: true

module ::ClientPerformance
  class Engine < ::Rails::Engine
    engine_name PLUGIN_NAME
    isolate_namespace ClientPerformance
  end
end
