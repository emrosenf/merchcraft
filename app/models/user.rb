class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, :confirmable, :facebook_open_graph_authenticatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :confirmed_bookmarklet
  
  has_many :wishlists
  
  protected
    
    # Callback to overwrite if confirmation is required or not.
    def confirmation_required?
      if Rails.env.development?
        self.skip_confirmation!
        return false
      else
        return !confirmed?
      end
    end
  
  def self.find_for_facebook_oauth(access_token, signed_in_resource=nil)
    data = access_token['extra']['user_hash']
    if user = User.find_by_email(data["email"])
      #debugger
      user.first_name = data["first_name"]
      user.last_name = data["last_name"]
      user.avatar = access_token["user_info"]["image"]
      user.uid = data["id"]
      user
    else # Create a user with a stub password. 
      user = User.create!(:email => data["email"], :password => Devise.friendly_token[0,20],
        :first_name => data["first_name"], :last_nae => data["last_name"], :avatar => access_token["user_info"]["image"], :uid => data["id"]) 
      user.skip_confirmation!
      user.save
      user
    end
  end
  
end
