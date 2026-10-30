const http = require("http");
const fs = require("fs");
const { WebSocketServer, WebSocket } = require("ws"); // this would export only WebSocketServer and WebSocket from the ws module
// require() is for importing modules

// createServer() takes in a function as a parameter, as long as the function itself has:
// req (request)
// res (response)
// as parameters. here they use a lambda rather than making a traditional function
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" }); // writes a response back to the computer (http status 200 means OK)
    fs.createReadStream(__dirname + "/game.html").pipe(res);
    // creates a read pipeline between the computer and the server
    // at the folder __dirname and file game.html, and puts it as a response
});

const wss = new WebSocketServer({ server }); // creates a WebSocketServer around the http server
// wss allows for a clean two directional connection and communication, much faster than just http

// .on is sort of like a listener that listens for the event stated in its first parameter
wss.on("connection", (socket) => { // listens for a connection
    socket.on("message", (data) => { // listens for a message
        for (const client of wss.clients) {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(data.toString()); // sends the data to every other client APART from the person who sent it
            }
        }
    });
});

server.listen(process.env.PORT || 3000);