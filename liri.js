require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

/** `my-tweets`
* `spotify-this-song`
* `movie-this`
* `do-what-it-says`
 */
