export const gemfile = `source 'https://rubygems.org'

group :test do
  gem 'rspec'
  gem 'simplecov'
  gem 'simplecov-lcov'
end`;

export const specHelper = `require 'simplecov'
require 'simplecov-lcov'

# Configure LCOV formatter
SimpleCov::Formatter::LcovFormatter.config do |c|
  c.report_with_single_file = true
  c.single_report_path = 'coverage/lcov.info'
end

# Use LCOV formatter
SimpleCov.formatter = SimpleCov::Formatter::LcovFormatter

# Start SimpleCov with filters and branch coverage
SimpleCov.start do
  add_filter '/spec/'
  add_filter '/test/'
  enable_coverage :branch  # Enable branch coverage tracking
end

# Your other test configuration...`;
