Rails.application.routes.draw do
  [AppConfig[:public_proxy_prefix], AppConfig[:public_prefix]].uniq.each do |prefix|
    scope prefix do
      post 'plugin/uva/request' => 'uva_request#proxy'
    end
  end
end
