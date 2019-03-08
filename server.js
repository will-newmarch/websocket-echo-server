"use strict";
(function(){
	var connections = []; // list of current connections
	var http = require('http'); // http require
	var WebSocketServer = require('websocket').server; // websocket require
	var webSocketsServerPort = 1337; // choose a port number
	
	var httpServer = http.createServer(function(request, response) { /* We don't need to do anything here as we're creating a WebSocket server, not an HTTP server */ });
	httpServer.listen(webSocketsServerPort, function() {
		console.log((new Date()) + " :: The server is listening on port " + webSocketsServerPort);
	});
	
	var webSocketServer = new WebSocketServer({
		httpServer: httpServer // WebSocket server is tied to a HTTP server. WebSocket request is just an enhanced HTTP request.
	});
	 
	webSocketServer.on('request', function(request) { // This callback function is called every time someone tries to connect to the WebSocket server
		console.log((new Date()) + " :: Connection from origin " + request.origin + ".");
		var connection = request.accept(null, request.origin); 
		var index = connections.push(connection); // Add connection to list of current connections
	 
		// user sent a message
		connection.on('message', function(message) {
			for (var i=0; i < connections.length; i++) { // broadcast message to all current connections
				connections[i].sendUTF(message.utf8Data);
			}
		});
	 
		// user disconnected
		connection.on('close', function(connection) {
			console.log((new Date()) + " :: Peer " + connection.remoteAddress + " disconnected.");
			connections.splice(index, 1); // remove user from the list of live connections
		});
	});
})();