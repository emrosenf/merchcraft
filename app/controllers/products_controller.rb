class ProductsController < ApplicationController
  def new
    if current_user != nil
        params = request.params
        p = Product.where("title = ?", params[:title])[0]
        if not p
            price = params[:price]
            if price and price[0] == "$"
                price = price[1..-1].to_f
            end
            p = Product.new :title => params[:title], :price => price, :url => params[:url], :image => params[:image]
        end
        current_user.wishlists.first.products << p
        
    end
  end

end
