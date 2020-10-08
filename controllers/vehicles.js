import { getDistance } from 'geolib';

function saveLocation(req,res) {
    const newLocation = req.body;
    const vehicleId = req.params.id;
    const newLat = newLocation.la;
    const newLong = newLocation.lo;
    if(req.app.vehicles[vehicleId]){
        const vehicleOldLocation = req.app.vehicles[vehicleId];
        const lat = vehicleOldLocation.lat;
        const long = vehicleOldLocation.long
        const ts = vehicleOldLocation.ts
        const timeDiffInSecs = (ts.getTime() - new Date().getTime())/1000 ;
        if(timeDiffInSecs <= 11) {
            const distance = getDistance(
                {latitude: lat, longitude: long},
                {latitude: newLat, longitude: newLong},
                0.01
            );
            if (distance <= 1) {
                req.app.io.emit('vehicle-error', {vehicleId});
            }
        }
    }
    req.app.vehicles[vehicleId] = {
        lat: newLat,
        long: newLong,
        ts: new Date()
    }
    req.app.io.emit('vehicle-updated', req.app.vehicles[vehicleId]);
    res.send(true)
}

function getAllVehicles(req, res) {
    res.json(req.app.vehicles);
}

module.exports = {
    saveLocation,
    getAllVehicles
}