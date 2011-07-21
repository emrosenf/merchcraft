class WishlistsController < ApplicationController

    def show
        id = params[:id]
        if id
            @w = Wishlist.find(id)
            if @w != nil
                
            end
        end
    end

end
