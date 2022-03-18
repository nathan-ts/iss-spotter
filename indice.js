const { nextISSTimesForMyLocation, printPassTimes } = require('./iss-promised');

// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then((body) => {
//     console.log(body);
//     return body;
//   })

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((err) => console.log(`Error: ${err.message}`))