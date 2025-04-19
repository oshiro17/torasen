Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # ユーザー作成・更新
      resources :users, only: [:create, :show, :update]
      # セッション（ログイン／ログアウト／ログイン状態確認）
      resource :sessions, only: [:create, :destroy, :show], controller: 'sessions'
    end
  end

  # ActiveStorage 等、他のルートはそのまま
end
