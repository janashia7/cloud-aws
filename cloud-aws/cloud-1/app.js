const axios = require('axios');

exports.handler = async (event) => {
  const ip = event.requestContext.http.sourceIp;
  const { data: dataIp } = await axios.get(`http://ip-api.com/json/${ip}`);
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${dataIp.city}&appid=${API_KEY}`
  );
  return data;
};
