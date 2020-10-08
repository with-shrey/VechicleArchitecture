const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const vehicleController = require('./controllers/vehicles');

const port = 3000;
app.vehicles = {};
app.io = io;

app.post('/:id/location', vehicleController.saveLocation)
app.get('/vehicles', vehicleController.getAllVehicles)
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(port, () => {
    console.log('listening on *:3000');
});