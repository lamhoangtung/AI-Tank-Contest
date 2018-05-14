#!/bin/bash

pwd=`pwd`
osascript -e "tell application \"Terminal\" to do script \"cd $pwd node ./Server/Server.js -h 127.0.0.1 -p 3011 -k 30 11\"" 
osascript -e "tell application \"Terminal\" to do script \"cd $pwd node ./Bots/Javascript/Client.js -h 127.0.0.1 -p 3011 -k 30\"" 
osascript -e "tell application \"Terminal\" to do script \"cd $pwd node ./Bots/Javascript/Client.js -h 127.0.0.1 -p 3011 -k 11\"" 
/Users/AD/Desktop/Projects/AI/Pack/Observer/index.html