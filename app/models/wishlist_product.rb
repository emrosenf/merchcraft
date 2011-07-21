class WishlistProduct < ActiveRecord::Base
  belongs_to :wishlist
  belongs_to :product
end
