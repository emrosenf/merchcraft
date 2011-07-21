require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  test "should get wishlists" do
    get :wishlists
    assert_response :success
  end

end
