class ProductsController < ApplicationController
  def new
    if current_user != nil
        params = request.params
        p = Product.where("name = ?", params[:name])[0]
        if not p
            p = Product.new :name => params[:name], :price => params[:price]
        end
        current_user.wishlists.first.products << p
        
    end
  end

end
