class BookmarkletController < ApplicationController

  def frame
    if user_signed_in?
      @wishlists = current_user.wishlists.map{|w| {:id => w.id, :title => w.title}}
    else
      @wishlists = {}
    end
    
  end
  
  
  def submit
    if user_signed_in?
      params = request.params
      w = nil
      if params[:new_wishlist]
        w = Wishlist.new :title => params[:new_wishlist_title]
      else
        w = Wishlist.find(params[:wishlist_id].to_i)
      end
      price = params[:price]
        if price and price[0] == "$"
            price = price[1..-1].to_f
        end
      p = Product.new :title => params[:title], :price => price, :url => params[:url], :image => params[:image]
        
      w.products << p
      
      w.save!
      p.save!
      render :json => {:status => 1, :message => "Okay"}, :content_type => 'text/json'
    else
      render :json => {:status => 0, :message => "User not signed in"}, :content_type => "text/json"
    end
    
  end

end