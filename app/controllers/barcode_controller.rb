require "sucker"
require 'pp'
require 'json'
require 'open-uri'

SHOPSAVVY_API_KEY = '5da1dabcf432d61e8f2f2d6abcf50643'

class BarcodeController < ApplicationController

  def analyze
    if params[:code]
      begin
        retVal = queryAmazon
      rescue Exception => e
        retVal = queryShopSavvy
      end
      render :json => retVal    
    end
  end
  
  def queryAmazon
  params = request.params
    code = params[:code]
    id_type = "UPC"
    search_index = "All"
    if code.slice(0,3) == "978"
      id_type = "ISBN"
      search_index = "Books"
    end
    request = Sucker.new
    request << {:Operation => 'ItemLookup', :IdType => id_type,
     :ItemId => code, :SearchIndex => search_index, :ResponseGroup => 'Medium'}
    response = request.get

    item = response['ItemLookupResponse'][0]['Items']['Item']
    if item.kind_of?(Array)
      item = item[0]
    end
    attributes = item['ItemAttributes']
    title = attributes["Title"]
    image = item["LargeImage"]["URL"]
    url = item["DetailPageURL"]
    price = attributes["ListPrice"]['FormattedPrice']
    retVal = {:title => title, :image => image, :price => price, :url => url, :source => "Amazon"}
    return retVal
  end
  
  def queryShopSavvy
    code = params[:code]
    json = JSON.parse(open("http://api.developer.shopsavvy.mobi/products/#{code}.json?apikey=#{SHOPSAVVY_API_KEY}").read)
    retVal = {:title => json["Title"], :image => json["ImageUrl"], :price => nil, :url => nil, :source => "ShopSavvy"}
    

  end
  
end