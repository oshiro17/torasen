# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # JSON（fetch や curl からの application/json）なら CSRF 認証をスキップ
  skip_before_action :verify_authenticity_token,
                     if: -> { request.format.json? }
end
