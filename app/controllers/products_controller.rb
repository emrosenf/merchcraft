class ProductsController < ApplicationController
  def new
    if current_user != nil
        params = request.params
        p = Product.where("title = ?", params[:title])[0]
        if not p
            p = Product.new :title => params[:title], :price => params[:price], :url => params[:url], :image => params[:image]
        end
        current_user.wishlists.first.products << p
        
    end
  end

end
