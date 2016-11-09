#
# Cookbook Name:: mysql-book
# Recipe:: default
#
# Copyright 2016, EnvoProv
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'apt'

mysql_service 'default' do
	bind_address '0.0.0.0'
	port '3306'
	initial_root_password 'testing'
	action [:create, :start]
end

mysql_client 'default' do
	action :create
end
