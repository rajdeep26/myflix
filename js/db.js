// NOTES:
// 1) the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.

// 2) undefined is passed because the value of undefined is guaranteed as
// being truly undefined. This is to avoid issues with undefined being mutable
// pre-ES5.
;(function (MF, $, window, undefined) {
  // window is passed through as local variable rather than globals
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).
  
  // Private properties
  var myflixDB = null,
      moviesTable = null,
      movieDetailsTable = null,
      actorsTable = null;

  initialize_myflix_db();

  MF.get_movies = function() {
    console.log("BEFORE get movies called ====> ");
    myflixDB.select().
        from(moviesTable).
        exec(function(results) {  
          // results is an array.
          // Each elements in the array is a nested object.
          console.log("movies ====> ", results);
        });
    console.log("AFTER get movies called");
  }

  MF.get_movie = function(movie_id) {
    // body...
  }

  MF.add_movie = function(movie_attrs) {
    var row = moviesTable.createRow(movie_attrs);
    myflixDB.insertOrReplace().into(moviesTable).values([row]).exec();
  }

  MF.delete_movie = function(argument) {
    // body...
  }

  // Private methods
  function initialize_myflix_db() {
    // SQL equivalent: CREATE DATABASE IF NOT EXISTS myflix
    var myflixSchemaBuilder = lf.schema.create('myflix', 1);

    // SQL equivalent:
    // CREATE TABLE IF NOT EXISTS Movies (
    //   id AS INTEGER,
    //   ...
    //   ...
    //   PRIMARY KEY ON ('id')
    // );
    myflixSchemaBuilder.createTable('movies')
        .addColumn('id', lf.Type.INTEGER)
        .addColumn('filename', lf.Type.STRING)
        .addColumn('file_path', lf.Type.STRING)
        .addColumn('modification_date', lf.Type.DATE_TIME)
        .addColumn('file_size', lf.Type.NUMBER)
        .addColumn('file_extension', lf.Type.STRING)
        .addPrimaryKey(['id']);
        // .addIndex('idxFilename', ['filename'], false, lf.Order.DESC);

    // Promise-based API to get the instance.
    myflixSchemaBuilder.connect().then(function(db) {
      console.log("db connection done");
      myflixDB = db;
      moviesTable = db.getSchema().table('movies');
      // var movieDetailsTable = db.getSchema().table('movie_details');
      // var actorsTable = db.getSchema().table('actors');
      console.log("db ==> ",db);
      console.log("myflixDB ==> ", myflixDB);
    });
  }

})(window.MF = window.MF || {}, jQuery, window);