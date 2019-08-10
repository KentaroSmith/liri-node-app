require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify= require("node-spotify-api");

var spotify = new Spotify(keys.Spotify);

//commands: 
//concert-this
//movie-this
//do-what-it-says
var keyTerm = process.argv.slice(2);
var searchString = toString(keyTerm);
//var searchString = keyTermstring.replace(',',' ');
//Bands in town api query function
var concertSearch = function(artist){
    console.log("concert")
        //change to one string instead of just argv3 later
        var artist = searchString;
    axios
    //bandsintown web api query
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {
        console.log(response.data);
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
    };

var songSearch = function(song){
    spotify.search({ type: 'track', query: song }, function(err, result) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(result.tracks); 
      });
};


switch(process.argv[2]){
    case ('concert-this'):
        console.log(searchString)
    concertSearch(searchString);
    break;
    case('spotify-this-song'):
    songSearch(searchString);
    break;
    //OMDB API
    case('movie-this'):
    console.log("Movie")
    break;
    //Spotify API
    case('do-what-it-says'):
    console.log("Read txt file");
fs.readFile("random.txt","utf8",function(error,data){
    if(error){
        return console.log(error)
    }
    var text = data.split(",");
    var command = text[0];
    var song = text[1]
    spotify.search({ type: 'track', query: song }, function(err, result) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(result.tracks); 
      });
})
    break;
    //unrecognized commands
    default:
        console.log("I don't know how to do that");
}
