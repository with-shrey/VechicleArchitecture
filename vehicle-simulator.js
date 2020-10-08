// Usage node vehicle-simuator.js 1
const { v4: uuidv4 } = require('uuid');
const axios = require('axios')

function runVehicle(index){
    var lat = 1, long = 2;
    setInterval(() => {
        axios.post('http://localhost:3001/'+index+'/location',
            {
                la: lat + Math.random(),
                lo: long  +Math.random()
            })
            .then(res => console.log('sent' + index))
            .catch(console.error)
    }, 9000)
}

if(process.argv.length >= 3){
    const numberOfVehicles = parseInt(process.argv[2]);
    for (let i = 0; i < numberOfVehicles; i++) {
        runVehicle(i)
    }
}