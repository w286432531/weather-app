require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

let displayUnit = "";
//use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  //request from index.html form   value of cityName
  const query = req.body.cityName;
  // private api key
  const apiKey = process.env.API_KEY;
  //unit setting
  const unit = req.body.choosedUnit;
  if (unit == "imperial") {
    displayUnit = "fahrenheit";
  } else displayUnit = "celsius";

  //create a const for api end point
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;
  https.get(url, function (responseFromHttps) {
    // to check if status is ok
    let statusCode = responseFromHttps.statusCode;
    console.log(statusCode);
    if (statusCode == 200) {
      // when received data as hexdecimal
      responseFromHttps.on("data", function (data) {
        // console.log(data);
        //turn hexdecimal into object
        const weatherData = JSON.parse(data);

        //turn object into hexdecimal
        // JSON.stringify(object);
        // console.log(weatherData);
        const temp = weatherData.main.temp;
        // console.log(temp);
        const weatherDescription = weatherData.weather[0].description;
        // console.log(weatherData.weather[0].description);
        const icon = weatherData.weather[0].icon;
        const getIcon = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        res.write("<p>The weather is currently " + weatherDescription + "</p>");
        res.write(
          "<h1>The temperature of " +
            query +
            " is " +
            temp +
            " degrees " +
            displayUnit +
            ".</h1>"
        );
        res.write("<img src='" + getIcon + "'>");
        res.write("<a href='/'><button>Go back</button></a>");
        res.send();
      });
    } else res.sendFile(__dirname + "/error.html");
  });
});

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
