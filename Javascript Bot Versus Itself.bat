pushd Server
start node Server.js -h 127.0.0.1 -p 3011 -k 30 11 -r Replay/Last.glr
popd
pushd Observer
start index.html
popd
pushd Bots
pushd Javascript
start node Client.js -h 127.0.0.1 -p 3011 -k 30
start node Client.js -h 127.0.0.1 -p 3011 -k 11