#!/bin/bash

# Check root permission
if [[ $EUID -ne 0 ]]; 
then
	echo "You must be root to perform this operation."
	exit 1
fi

# Update system and upgarde pakages
apt update
apt upgrade

# Install prerequisite packages
apt install -y curl git gnupg gcc g++ make

# Install mongodb
# Reference Link: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
curl https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
apt update
apt install -y mongodb-org

# Install node.js
# Reference Link: https://github.com/nodesource/distributions/blob/master/README.md#debinstall
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
apt install -y nodejs

# Install Yarn
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
apt update
apt install -y yarn

# Check versions and initialize system
nodejs --version
npm --version
systemctl daemon-reload
systemctl start mongod
systemctl status mongod
