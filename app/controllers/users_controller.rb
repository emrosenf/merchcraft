class UsersController < ApplicationController
  def wishlists
    params = request.params
    if params[:id]
        u = User.find(params[:id])
        if u
            @wishlists = u.wishlists
        end
    end
  end
  
  def bookmarklet
  
  end
  
  def confirm_bookmarklet
    current_user.confirmed_bookmarklet = true
    current_user.save!
    render :json => {:status => 1, :message => "Okay"}, :content_type => 'text/json'
  end

end
