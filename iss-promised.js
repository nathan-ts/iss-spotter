// iss_promised.js
const request = require('request-promise-native');

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  let url = "http://ip-api.com/json/";
  return request(url);
};

/* 
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(body) {
  let url = `https://api.freegeoip.app/json/${JSON.parse(body).query}?apikey=d2496980-a650-11ec-a854-a747a545602c`;
  return request(url);
};

const fetchISSFlyOverTimes = function(coords) {
  coords = JSON.parse(coords);
  let url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  // console.log(JSON.parse(coords).latitude, coords.longitude);
  return request(url)
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
