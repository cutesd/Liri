// dotenv package to use keys locally
require("dotenv").config();
var fs = require("fs");

//
var keys = require("./keys.js");

// Twitter
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// Spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// OMDB
var request = require('request');


runCommand(process.argv[2], process.argv[3]);

function runCommand(cmd, val) {
    logActivity(cmd, val);
    //
    switch (cmd) {
        case 'my-tweets':
            runTweet();
            break;
        case 'spotify-this-song':
            runSpotify(val);
            break;
        case 'movie-this':
            runOmdb(val);
            break;
        case 'do-what-it-says':
            runFS();
            break;
        default:
            trace('Sorry, cannot process your request.');
    }
}

/** node liri.js my-tweets
This will show your last 20 tweets and when they were created at in your terminal/bash window.*/

//
function runTweet() {
    var str = '';
    var cnt = 0;
    var params = { screen_name: 'CutesdKC' };
    client.get('statuses/user_timeline', params, function (err, tweets, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (const key in tweets) {
            if (tweets.hasOwnProperty(key) && cnt < 20) {
                const obj = tweets[key];
                str += 'TWEET #' + (cnt + 1) + '\n';
                str += obj.created_at + '\n';
                str += obj.text + '\n';
                cnt++;
            }
        }
        trace(str);

    });

}

/* node liri.js spotify-this-song '<song name here>'

This will show the following information about the song in your terminal/bash window

* Artist(s)
* The song's name
* A preview link of the song from Spotify
* The album that the song is from

If no song is provided then your program will default to "The Sign" by Ace of Base.
You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.

*/

//
function runSpotify(val) {
    var track_name = (val === undefined) ? 'The Sign' : val;
    var str = '';
    var idx = 0;

    spotify.search({ type: 'track', query: track_name }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        data.tracks.items.every((cell, i) => {

            if (cell.name.toLowerCase() === track_name.toLowerCase()) {
                idx = i;
                return false;
            } else {
                return true;
            }
        });

        var obj = data.tracks.items[idx];
        str += 'ARTIST:  ' + obj.artists[0].name + '\n';
        str += 'SONG NAME:  ' + obj.name + '\n';
        str += 'LINK:  ' + obj.external_urls.spotify + '\n';
        str += 'ALBUM:  ' + obj.album.name + '\n';

        trace(str);

    });

}


/* node liri.js movie-this '<movie name here>'

 * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.

*/

//
function runOmdb(val) {
    if (val === undefined) val = "Mr Nobody";
    var str = '';

    request('http://www.omdbapi.com/?t=' + val + '&apikey=trilogy', function (err, response, body) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var obj = JSON.parse(body);
        str += "TITLE:  " + obj["Title"] + '\n';
        str += "YEAR:  " + obj["Year"] + '\n';
        str += "IMDB RATING:  " + obj["imdbRating"] + '\n';
        str += "ROTTEN TOMATOES RATING:  " + obj["Ratings"][1]["Value"] + '\n';
        str += "COUNTRY:  " + obj["Country"] + '\n';
        str += "LANGUAGE:  " + obj["Language"] + '\n';
        str += "PLOT:  " + obj["Plot"] + '\n';
        str += "ACTORS:  " + obj["Actors"] + '\n';
        trace(str);

    });

}



/* node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
Feel free to change the text in that document to test out the feature for other commands.

 */

//
function runFS() {

    fs.readFile("random.txt", "utf8", function (err, data) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }

        // We will then print the contents of data
        console.log("runFS", data);

        var _arr = data.split(",");
        runCommand(_arr[0], _arr[1]);

    });

}

// Outputs string and logs activity
function trace(str) {
    console.log(str + '\n');
}


//
function logActivity(cmd, val) {
    var str = 'node liri.js ';
    if (cmd !== undefined) str += cmd + " ";
    if (val !== undefined) str += val + " ";
    str += '\n';
    //
    fs.appendFile("log.txt", str, function (err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }

        console.log("log.txt updated");
        console.log("========================");

    });
}