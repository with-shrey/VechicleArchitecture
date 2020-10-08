const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const vehicleController = require('./controllers/vehicles');

const port = 3001;
app.vehicles = {};
app.io = io;
app.use(cors())
app.use(bodyParser())
app.post('/:id/location', vehicleController.saveLocation)
app.get('/vehicles', vehicleController.getAllVehicles)
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(port, () => {
    console.log('listening on *:'+port);
});