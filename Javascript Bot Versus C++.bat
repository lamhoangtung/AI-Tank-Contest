pushd Server
start node Server.js -h 127.0.0.1 -p 3011 -k 30 11
popd
pushd Observer
start index.html
popd
pushd Bots
pushd Javascript
start node Client.js -h 127.0.0.1 -p 3011 -k 30
popd
pushd C++
start AI_Template.exe -h 127.0.0.1 -p 3011 -k 11
popd
popd