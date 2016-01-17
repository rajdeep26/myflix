var fetchedMovieData = []
var movie_detail = 0
var db_movie_id = 0
var xhr = new XMLHttpRequest();
xhr.onload = function() {
    var json = xhr.responseText;                         // Response
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);                             // Parse JSON
    // ... enjoy your parsed json...
    if (json.Response ==  "False"){
        console.log("Sorry")
        // id +=1;

    } else {
        var date = new Date(json.Released);
        var movie_attr = {
            id:movie_detail,
            movie_id: db_movie_id,
            rating: json.imdbRating,
            director: json.Director,
            release_year: parseInt(json.Year),
            duration_mins: parseInt(json.Runtime.match(/\d/g).join("")),
            title: json.Title,
            description: json.Plot,
            poster_url: json.Poster,
            type: json.Type,
            release_date: date,
        }

        fetchedMovieData.push(movie_attr);
        MF.add_movie_details(movie_attr);
        console.log(json);
        movie_detail+=1;
        console.log("API called");
        console.log(fetchedMovieData.length);
    }
    
};
// Example:
function queryOmdb(movieTitle, movieID){
    db_movie_id = movieID;
    xhr.open('GET', 'http://www.omdbapi.com/?t=' + encodeURIComponent(movieTitle));    
    console.log(movieTitle);
    xhr.send();
    console.log("calling API");
}