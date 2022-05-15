#!/usr/bin/env bash

echo starting mysql server
sudo /etc/init.d/mysql start

echo installing dependencies
npm install

echo starting NodeJS server
sudo npm start 

echo OK!