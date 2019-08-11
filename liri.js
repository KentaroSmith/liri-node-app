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
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.Spotify);

//commands: 
//concert-this
//movie-this
//do-what-it-says
var searchString = process.argv.slice(3).join(' ');

//Bands in town api query function
var concertSearch = function (artist) {
  axios
    //bandsintown web api query
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
      console.log("Here is some information about the next few " + artist + " events:");
      for (var i = 0; i < response.data.length; i++) {
        console.log("====================================================");
        console.log(response.data[i].venue.name);
        console.log(response.data[i].venue.city + ", " + response.data[i].venue.region);
        console.log(response.data[i].venue.country);
        var concertDate = moment(response.data[i].venue.datetime).format('MM/DD/YYYY');
        console.log(concertDate);
        console.log("====================================================");
      }

    })
    //Catching error messages (for debugging purposes)
    .catch(function (error) {
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

var songSearch = function (song) {
  if (!song) {
    song = "The Sign"
  }
  spotify.search({ type: 'track', query: song }, function (err, result) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("Here is some information about songs named: " + song);
    console.log("====================================================");
    console.log("Full result: " + result.tracks.items[0].album.name)

    for (var i = 0; i < result.tracks.items.length; i++) {
      //var log = result.tracks.items;
      //fs.appendFile("log.txt", log)
      console.log("Song Name: " + result.tracks.items[i].name)
      console.log("Artist Name: " + result.tracks.items[i].artists[0].name)
      console.log("Album Name: " + result.tracks.items[i].album.name);
      console.log("Listen: " + result.tracks.items[i].external_urls.spotify);
      console.log("====================================================");
    }

  });
};

var movieSearch = function (title) {
  if (!title) {
    title = "Mr. Nobody";
  }
  axios
    .get("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
      console.log("Here is some information about the movie: " + title);
      console.log("====================================================");
      console.log("Movie Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Production Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Cast: " + response.data.Actors);
    })
    .catch(function (error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}


switch (process.argv[2]) {
  case ('concert-this'):
    concertSearch(searchString);
    break;
  case ('spotify-this-song'):
    songSearch(searchString);
    break;
  //OMDB API
  case ('movie-this'):
    movieSearch(searchString);
    break;
  //using fs to read files
  case ('do-what-it-says'):
    fs.readFile("random.txt", "utf8", function (error, data) {
      if (error) {
        return console.log(error)
      }
      var text = data.split(",");
      var command = text[0];
      var searchTerm = text[1]
      switch (command) {
        case ('concert-this'):
          concertSearch(searchTerm);
          break;
        case ('spotify-this-song'):
          songSearch(searchTerm);
          break;
        case ('movie-this'):
          movieSearch(searchTerm);
          break;

      }
    })
    break;
  //unrecognized commands
  default:
    console.log("I don't know how to do that");
}
