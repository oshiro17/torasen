module Api
    module V1
      class UsersController < ApplicationController
        # before_action :require_login, only: [:show, :update]
    # skip_before_action :verify_authenticity_token 
    skip_forgery_protection
        # POST /api/v1/users
        def create
          user = User.new(user_params)
          if user.save
            render json: { success: true, user: { id: user.id, username: user.username } }
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        # GET /api/v1/users/:id
        def show
          render json: { user: { id: current_user.id, username: current_user.username } }
        end
  
        # PUT /api/v1/users/:id
        def update
          if current_user.update(user_params)
            render json: { success: true, user: { id: current_user.id, username: current_user.username } }
          else
            render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        private
  
        def user_params
          params.permit(:username, :password, :password_confirmation)
        end
  
        def require_login
          unless session[:user_id] && current_user
            render json: { error: 'ログインが必要です' }, status: :unauthorized
          end
        end
  
        def current_user
          @current_user ||= User.find_by(id: session[:user_id])
        end
      end
    end
  end
  