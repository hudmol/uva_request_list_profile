Plugins::extend_aspace_routes(File.join(File.dirname(__FILE__), "routes.rb"))

# set handler url:
AppConfig[:request_list][:request_handlers][:uva_handler][:url] = "#{AppConfig[:public_proxy_prefix]}plugin/uva/request"
