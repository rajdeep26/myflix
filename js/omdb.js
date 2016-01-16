var fetchedMovieData = []


var xhr = new XMLHttpRequest();
xhr.onload = function() {
    var json = xhr.responseText;                         // Response
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);                             // Parse JSON
    // ... enjoy your parsed json...
    if (json.Response ==  "False"){
        console.log("Sorry")
    } else {
        fetchedMovieData.push({
            movieID: json.imdbID,
            rating: json.imdbRating,
            director: json.Director,
            releasedYear: json.Year,
            duration: json.Runtime,
            title: json.Title,
            description: json.Plot,
            poster: json.Poster,
            type: json.Type,
            releaseDate: json.Released,
        })
    }
};
// Example:
function queryOmdb(movieTitle){
    xhr.open('GET', 'http://www.omdbapi.com/?t=' + encodeURIComponent(movieTitle));    
    xhr.send();
}