class CreateWishlistProducts < ActiveRecord::Migration
  def self.up
    create_table :wishlist_products do |t|
      t.references :wishlist
      t.references :product
      t.boolean :owns
      t.boolean :wants

      t.timestamps
    end
  end

  def self.down
    drop_table :wishlist_products
  end
end
