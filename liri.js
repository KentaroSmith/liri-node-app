require("dotenv").config();
//For reading spotify client and secret
var keys = require("./keys.js");
//lets us query different API's
var axios = require("axios");
//Formatting for dates and times
var moment = require("moment");
//Reading, writing and appending files
var fs = require("fs");
//Spotify Node API
var Spotify= require("node-spotify-api");

var spotify = new Spotify(keys.Spotify);

//commands: 
//concert-this
//movie-this
//do-what-it-says
var searchString = process.argv.slice(3).join(' ');

//Bands in town api query function
var concertSearch = function(artist){
    axios
    //bandsintown web api query
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {
        console.log("Here is some information about the next few "+artist+" events:");
        for(var i=0;i<response.data.length;i++){
            console.log("====================================================");
            console.log(response.data[i].venue.name);
            console.log(response.data[i].venue.city+", "+response.data[i].venue.region);
            console.log(response.data[i].venue.country);
            var concertDate = moment(response.data[i].venue.datetime).format('MM/DD/YYYY');
            console.log(concertDate);
            console.log("====================================================");
        }
        
      })
      //Catching error messages (for debugging purposes)
      .catch(function(error) {
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
      });
    };

var songSearch = function(song){
    if(!song){
        song = "The Sign"
    };
    spotify.search({ type: 'track', query: song }, function(err, result) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for(var i=0;i<result.tracks.items.length;i++){
            console.log("Here is some information about songs named: "+song);
            console.log("====================================================");
            console.log("Song Name: "+result.tracks.items[i].name);
            console.log("Artist Name: "+result.tracks.items[i].album.artists.name); 
            console.log("Listen: "+result.tracks.items[i].external_urls.spotify); 
            console.log("====================================================");
        }
      
      });
};


switch(process.argv[2]){
    case ('concert-this'):
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
