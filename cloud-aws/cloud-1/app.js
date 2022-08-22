const axios = require("axios");

exports.handler = async (event) => {
  const ip = event.requestContext.http.sourceIp;
  const { data: dataIp } = await axios.get(`http://ip-api.com/json/${ip}`);
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${dataIp.city}&appid=669b5487a7cf7957358223f02736c5a8`
  );
  return data;
};
