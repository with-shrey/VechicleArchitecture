import React, {useEffect, useState} from 'react';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001";
const socket = socketIOClient(ENDPOINT);

function App() {
    const [vehicles, setVehicles] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlighted, setHighlighted] = useState([]);

    const fetchVehicles = () => {
        fetch("http://localhost:3001/vehicles")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setLoading(false)
                    setVehicles(result);
                    setError(null)
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setLoading(false)
                    setError(error.message)
                }
            )
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        socket.on("vehicle-error", data => {
            setHighlighted([...highlighted, data.vehicleId])
        });
        socket.on("vehicle-updated", data => {
            const newHighlighted = highlighted.filter(id => id !== data.id);
            setHighlighted(newHighlighted);
            const newVehicles = {
                ...vehicles,
                [data.id]: data
            }
            console.log(vehicles, newVehicles)
            setVehicles(newVehicles);
        });
    }, [vehicles])

    if (loading) {
        return (
            <div>
                <div>
                    Loading...
                </div>
            </div>
        )
    }
    if (error) {
        return (
            <div>
                <div>
                    {error}
                </div>
            </div>
        )
    }

    const vehiclesMarkup = Object.values(vehicles).map(vehicle => {
        const isHighlighted = highlighted.includes(vehicle.id)
        return (
            <div style={{background: isHighlighted ? 'yellow' : 'white'}}>
                <div>Id: {vehicle.id}</div>
                <div>Lat: {vehicle.lat}</div>
                <div>Long: {vehicle.long}</div>
                ---
            </div>
        )
    })
    return (
        <div>
            {vehiclesMarkup}
        </div>
    );
}

export default App;
