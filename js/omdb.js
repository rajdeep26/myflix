var xhr = new XMLHttpRequest();
xhr.onload = function() {
    var json = xhr.responseText;                         // Response
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);                             // Parse JSON
    // ... enjoy your parsed json...
    if (json.Response ==  "False"){
        console.log("Sorry")
    } else {
        console.log(json)
    }
};
// Example:
function queryOmdb(movieTitle){
    xhr.open('GET', 'http://www.omdbapi.com/?t=' + encodeURIComponent(movieTitle));    
    xhr.send();
}