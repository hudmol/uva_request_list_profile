class UvaRequestController <  ApplicationController

  skip_before_action  :verify_authenticity_token

  def proxy
    uri = URI(AppConfig[:request_list][:request_handlers][:uva_handler][:broker_url])

    req = Net::HTTP::Post.new(uri)
    req['Content-Type'] = 'text/json'
    req.set_form_data(:request_data => params[:request_data])

    response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') do |http|
      http.request(req)
    end

    if response.code == '200'
      flash[:success] = I18n.t('plugin.request_list.uva.messages.success')
    else
      flash[:error] = I18n.t('plugin.request_list.uva.messages.fail')
    end

    redirect_to(controller: :request_list, action: :index)
  end
end
