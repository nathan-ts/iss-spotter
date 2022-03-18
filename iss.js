
const request = require('request');

/** fetchMyIP(callback)
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 * Uses API: https://ip-api.com/docs/api:json
 */
const fetchMyIP = function(done) {
  let url = "http://ip-api.com/json/";
  request(url, (err, response, body) => {
    if (err) {
      done(err, null);
      return;
    }
    const data = JSON.parse(body);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      done(Error(msg), null);
      return;
    }
    done(null, data.query);
  });
};

const fetchCoordsByIP = function(ip, done) {
  let url = `https://api.freegeoip.app/json/${ip}?apikey=d2496980-a650-11ec-a854-a747a545602c`;
  request(url, (err, response, body) => {
    if (err) {
      done(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      done(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const coords = { latitude: data.latitude, longitude: data.longitude };
    done(null, coords);
  });

};
/** fetchISSFlyOverTimes(coords, callback)
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, done) {
  console.log(coords);
  let url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (err, response, body) => {
    if (err) {
      done(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching flyover times for coordinates. Response: ${body}`;
      done(Error(msg), null);
      return;
    }
    const data = JSON.parse(body).response;
    done(null, data);
  });
};

/**nextISSTimesForMyLocation(callback)
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 


const nextISSTimesForMyLocation = function(callback) {
  let risetimes = {};

  fetchMyIP((err, ip) => {
    if (err) {
      console.log(err);
      return;
    }
    let myIP = ip;
    // console.log(`my IP address is ${myIP}`);
  
    fetchCoordsByIP(myIP, (err, data) => { 
      if (err) {
        console.log(err);
        return;
      }
      let coords = data;
      // console.log(`my coordinates are ${JSON.stringify(coords)}`);

      fetchISSFlyOverTimes(coords, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        risetimes = data;
        // console.log(`the next 5 flyovers are ${JSON.stringify(risetimes)}`);
        
        // PRINT OUT FLY OVER TIMES
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',};
        for (let rise of risetimes) {
          // console.log(rise);
          const dateTimeStr = new Date(rise.risetime * 1000).toLocaleDateString(undefined, options);
          
          // const result = (dateTimeStr.split(", ")[1]).split(":").join("/");
          console.log(`Next pass at ${dateTimeStr} for ${rise.duration} seconds!`);
        }
      }); 
  
    });
  
  });


}




module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };