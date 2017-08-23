
//todo- fix the song sign doesnt play if no paramters
//todo- fix the movie doesnt come up when no search
//todo- fix if movie has a string of words, only searching first word

    // var keys = require("./keys.js");
    var twitterKeys = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    };

    var spotifyKeys = {
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    };

    var omdbKey = process.env.OMDB_API_KEY;


    var Twitter = require("twitter");
    var Spotify = require ("node-spotify-api");
    var request = require("request"); //for OMDB app

    var liriCommand = process.argv[2];

    var fs = require("fs"); //file system: to read & write

//---------------------------------------------------------------//

if (liriCommand === "my-tweets") {
  accessTweets();
} else if (liriCommand === "spotify-this-song") {
  accessSpotify();
} else if (liriCommand === "movie-this") {
  accessMovie();
} else if (liriCommand === "do-what-it-says") {
  doWhatItSays()};



//--------------------------Twitter--------------------------------//

function accessTweets() {
    fs.appendFile('./log.txt', 'Command: node liri.js my-tweets' +'\n'
        + '-------------' + '\n\n', (err) => {
        if (err) throw err;
    });

    //initialize & parameters
    var client = new Twitter(twitterKeys);
    var params = {screen_name: twitterUsername, count: 20};
    var twitterUsername = process.argv[3];

        if(!twitterUsername){
            twitterUsername = "DFlecktions";
        }

    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            for (var i =0; i < tweets.length; i++) {
                var twitterResults = tweets[i].user.screen_name + ": "
                + "\n" + tweets[i].text + "\n" + tweets[i].created_at + "\n";
                console.log(twitterResults);
                log(twitterResults)
            }
            } else {
                return console.log('Error retrieving tweets: ' + error);
            }
    });
}

//-------------------------spotify--------------------------------//

function accessSpotify(songName) {
    fs.appendFile('./log.txt', 'Command: node liri.js spotify-this-song' + songName +'\n'
        + '-------------' + '\n\n', (err) => {
        if (err) throw err;
    });

    //initialize & parameters
    var spotify = new Spotify(spotifyKeys);

    var songName = process.argv[3];
    var params = songName;

    if (!songName) {
        songName = "The+Sign";
    }

    spotify.search ({type: 'track', query: params}, function(error, data) {
        if (!error) {
            for (var i=0; i < 10; i ++) {
                var songResults = data.tracks.items;
                var spotifyResults =
                "Artist: " + songResults[i].artists[0].name + '\n' +
                "Song: " + songResults[i].name + '\n' +
                "Album: " + songResults[i].album.name + '\n' +
                "Preview link: " + songResults[i].preview_url + '\n';
                console.log(spotifyResults);
                log(spotifyResults);
            }
            } else {
                console.log('Error retrieving songs: ' + error);
            }
    });
}

//----------------------------OMDB--------------------------------//

function accessMovie(movie) {

        fs.appendFile('./log.txt', 'Command: node liri.js movie-this' + movie + '\n'
        + '-------------' + '\n\n', (err) => {
        if (err) throw err;
    });
        var search;
        var movie = process.argv[3];

        if (movie === "undefined") {
            movie = "Mr. nobody";
        }

        // search = search.split(' ') + search.join('+');
        var queryStr = "http://www.omdbapi.com/?apikey=" + omdbKey + "&t="+ search + "&y&plot=short&r=json&tomatoes=true"


        request(queryStr, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var movieObject= JSON.parse(body);
                console.log(movieObject);
                var movieResult=
                "Title: " + movieObject.Title + '\n' +
                "Year: " + movieObject.Year + '\n' +
                "Imdb Rating: " + movieObject.Rating + '\n' +
                "Rotten Tomatoes Rating: " + movieObject.tomatoRating + '\n' +
                "Country: " + movieObject.Country + '\n' +
                "Language: " + movieObject.Language + '\n' +
                "Plot: " + movieObject.Plot + '\n' +
                "Actors: " + movieObject.Actors + '\n';
                // console.log(movieResults);
                log(movieResult);
            } else {
                return console.log("Error: " + error);
                }
        });
}

//---------------------Do what it says----------------------------//

function doWhatItSays() {
        fs.appendFile('./log.txt', 'Command: node liri.js do-what-it-says\n\n', (err) => {
        if (err) throw err;
    });
        fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log('ERROR: ' + error);
        } else {
            // Split out the command name and the parameter name
            var cmdString = data.split(',');
            var command = cmdString[0].trim();
            var param = cmdString[1].trim();
            }
            accessSpotify(param);
        });
}


//-------------------------log.txt--------------------------------//
    function log(logResults) {
      fs.appendFile("log.txt", logResults + '\n', (error) => {
        if(error) {
          throw error;
        }
      });
    }