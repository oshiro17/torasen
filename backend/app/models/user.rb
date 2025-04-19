class User < ApplicationRecord
    # bcrypt の機能を有効にして password と password_confirmation の
    # virtual attribute を使えるようにする
    has_secure_password
  
    validates :username,
      presence: true,
      uniqueness: true,
      length: { in: 3..30 },
      format: { with: /\A[a-zA-Z0-9_]+\z/,
                message: 'は英数字とアンダースコアのみ使用できます' }
  end
  