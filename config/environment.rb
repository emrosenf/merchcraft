# Load the rails application
require File.expand_path('../application', __FILE__)


# Load custom config variables
raw_config = File.read("#{Rails.root}/config/app_config.yml")
APP_CONFIG = YAML.load(raw_config)[Rails.env].symbolize_keys!

config.action_mailer.default_url_options = { :host => APP_CONFIG["domain"] }

# Initialize the rails application
Merchcraft::Application.initialize!

Encoding.default_internal = 'UTF-8'