# See http://docs.chef.io/config_rb_knife.html for more information on knife configuration options

current_dir = File.dirname(__FILE__)
log_level                :info
log_location             STDOUT
node_name                "gauravaradhye"
client_key               "#{current_dir}/gauravaradhye.pem"
chef_server_url          "https://api.chef.io/organizations/envoprov"
cookbook_path            ["#{current_dir}/../cookbooks"]

knife[:aws_access_key_id] = ""
knife[:aws_secret_access_key] = ""
knife[:ssh_key_name] = "chef-keypair"
#knife[:aws_config_file] = File.join(ENV['HOME'], "/.aws/configuration")
