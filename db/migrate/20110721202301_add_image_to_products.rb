class AddImageToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :image, :string
    add_column :products, :url, :string
    rename_column :products, :name, :title
  end

  def self.down
    remove_column :products, :url
    remove_column :products, :imagei
    rename_column :products, :title, :name
  end
end
