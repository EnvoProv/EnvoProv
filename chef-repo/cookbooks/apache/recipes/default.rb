#
# Cookbook Name:: apache
# Recipe:: default
#
# Copyright 2016, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

package "apache2" do
  action :install
end

service "apache2" do
  action [:enable, :start]
end


template '/var/www/html/index.html' do
  source 'index.html.erb'
end

cookbook_file '/var/www/html/hello-chef.png' do
  source 'hello-chef.png'
  mode '0755'
  action :create
end
