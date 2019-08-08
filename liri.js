require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
//var spotify = new spotify(keys.spotify)

//commands:
//concert-this
//movie-this
//do-what-it-says
var userCommands = process.argv;
for (var i = 2; i < userCommands.length; i++) {

}

axios.get("https://en.wikipedia.org/wiki/Kudos_(granola_bar)").then(
    function (response) {
        console.log(response.data);
    },

    function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        console.log(error.config);
    }
);