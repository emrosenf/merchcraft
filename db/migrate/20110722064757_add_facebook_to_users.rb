class AddFacebookToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :avatar, :string
    add_column :users, :uid, :string
  end

  def self.down
    remove_column :users, :uid
    remove_column :users, :avatar
  end
end
