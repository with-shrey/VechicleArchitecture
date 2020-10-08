import React, {useEffect, useState} from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState([]);

  const fetchVehicles = () => {
    fetch("http://localhost:3000/vehicles")
        .then(res => res.json())
        .then(
            (result) => {
              setLoading(false)
              setVehicles(result.body);
              setError(null)
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setLoading(false)
              setError(error)
            }
        )
  }

  useEffect(() => {
    fetchVehicles();
    const socket = socketIOClient(ENDPOINT);
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
        setVehicles(newVehicles);
    });
  }, []);

  if(loading){
      return (
          <div>
              <div>
                  Loading...
              </div>
          </div>
      )
  }

  const vehiclesMarkup = Object.values(vehicles).map(vehicle => (
      <div>
          <div>{vehicle.id}</div>
          <div>{vehicle.lat}</div>
          <div>{vehicle.long}</div>
      </div>
  ))
  return (
    <div>
        {vehiclesMarkup}
    </div>
  );
}

export default App;
