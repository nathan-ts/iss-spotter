const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss-promised');

fetchMyIP()
  .then(fetchCoordsByIP)
  .then((body) => {
    console.log(body);
    return body;
  })
  .then(fetchISSFlyOverTimes)
  .then((body) => {
    console.log(body);
    return body;
  })