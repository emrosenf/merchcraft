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

end
