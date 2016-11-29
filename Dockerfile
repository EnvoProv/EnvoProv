FROM node:6.2-onbuild

RUN apt-get update

# Linking nodejs and node - required for wit ai token
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Installing chef and knife
RUN wget https://packages.chef.io/stable/ubuntu/12.04/chefdk_0.19.6-1_amd64.deb
RUN dpkg -i chefdk_0.19.6-1_amd64.deb > /dev/null
RUN chef gem install knife-block > /dev/null

# Installing mongodb
RUN apt-get update
RUN apt-get -y install mongodb

# Creating ssh directory
RUN mkdir -p /root/.ssh
