FROM node:6.2-onbuild
#FROM ubuntu:latest

RUN apt-get update

RUN apt-get -y install nodejs
RUN apt-get -y install npm
RUN apt-get install -y wget
# Linking nodejs and node - required for wit ai token
RUN ln -s /usr/bin/nodejs /usr/bin/node
#RUN chmod +x setup.sh

# Installing chef and knife
RUN wget https://packages.chef.io/stable/ubuntu/12.04/chefdk_0.19.6-1_amd64.deb
RUN dpkg -i chefdk_0.19.6-1_amd64.deb > /dev/null
RUN chef gem install knife-block > /dev/null
#RUN /usr/src/app/setup.sh

# Installing mongodb
RUN apt-get update
RUN apt-get -y install mongodb

# Running mongodb service
#RUN service mongodb start
