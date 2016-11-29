#!/bin/bash
echo "$chef_private_key" > .chef/chefKey.pem
chmod 600 .chef/chefKey.pem
