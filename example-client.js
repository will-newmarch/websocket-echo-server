// Copy paste this into the console of Chrome...

var ws = new WebSocket("ws://localhost:1337");
ws.onmessage = function(data){ console.log(data); }
ws.send("Hello there!");