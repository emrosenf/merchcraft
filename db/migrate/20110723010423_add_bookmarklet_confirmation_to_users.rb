class AddBookmarkletConfirmationToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :confirmed_bookmarklet, :boolean
  end

  def self.down
    remove_column :users, :confirmed_bookmarklet
  end
end
