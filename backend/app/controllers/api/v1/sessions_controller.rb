module Api
    module V1
      class SessionsController < ApplicationController
        # CSRFをAPIトークン方式にするか無効化する設定があれば調整
        skip_before_action :verify_authenticity_token
  
        def create
          user = User.find_by(username: params[:username])
          if user&.authenticate(params[:password])
            session[:user_id] = user.id
            render json: { logged_in: true, user: { id: user.id, username: user.username } }
          else
            render json: { logged_in: false, error: '認証に失敗しました' }, status: :unauthorized
          end
        end
  
        def destroy
          session.delete(:user_id)
          render json: { success: true }
        end
  
        def show
          if current_user
            render json: { logged_in: true, user: { id: current_user.id, username: current_user.username } }
          else
            render json: { logged_in: false }
          end
        end
  
        private
  
        def current_user
          @current_user ||= User.find_by(id: session[:user_id])
        end
      end
    end
  end