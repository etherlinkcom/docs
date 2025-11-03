#! /bin/bash

wget -O temple.zip https://github.com/madfish-solutions/templewallet-extension/releases/download/2.0.13/chrome.zip
unzip temple.zip -d temple-chrome
rm temple.zip

wget -O metamask.zip https://github.com/MetaMask/metamask-extension/releases/download/v13.7.0/metamask-chrome-13.7.0.zip
unzip metamask.zip -d metamask-chrome
rm metamask.zip