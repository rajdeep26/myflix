var fetchedMovieData = []
var movie_detail = 0

var xhr = new XMLHttpRequest();
xhr.onload = function() {
    var json = xhr.responseText;                         // Response
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);                             // Parse JSON
    // ... enjoy your parsed json...
    if (json.Response ==  "False"){
        console.log("Sorry")
        id +=1;
    } else {
        fetchedMovieData.push({
            id:movie_detail,
            movie_id: json.imdbID,
            rating: json.imdbRating,
            director: json.Director,
            released_year: json.Year,
            duration_mins: json.Runtime,
            title: json.Title,
            description: json.Plot,
            poster_url: json.Poster,
            type: json.Type,
            release_date: json.Released,
        })
        id+=1;
        console.log("API called");
    }
};
// Example:
function queryOmdb(movieTitle){
    xhr.open('GET', 'http://www.omdbapi.com/?t=' + encodeURIComponent(movieTitle));    
    xhr.send();
    console.log("calling API");
}