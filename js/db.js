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
      movieDirectoriesTable = null,
      actorsTable = null;

  // Public properties
  MF.moviesYearWise = [];


  initialize_myflix_db();

  MF.print_prom_data = function(prom) {
    prom.then(function(data) {
      console.log("select results ==> ", data);
    });
  }

  /*
  ==========================================================
   Movies directory API
  ==========================================================
  */

  MF.add_movie_directory = function(dir_path) {
    // Delete everything from the DB
    // myflixDB.delete().from(movieDirectoriesTable).exec();

    // Add a new directory entry
    var prom = add_row(movieDirectoriesTable, {id: 0, directory_path: dir_path});
    return prom;
  }

  /*
  ==========================================================
   Movies CRUD API
  ==========================================================
  */

  MF.get_movies = function() {
    return get_list(moviesTable);
  }

  MF.get_movie = function(movie_id) {
    return get_row(moviesTable, movie_id);
  }  

  MF.add_movie = function(movie_attrs) {
    return add_row(moviesTable, movie_attrs);
  }

  MF.delete_movie = function(movie_id) {
    return delete_row(moviesTable, movie_id);
  }

  MF.get_movies_w_details = function() {
    var prom = myflixDB.select().
                        from(moviesTable).
                        innerJoin(movieDetailsTable, movieDetailsTable.movie_id.eq(moviesTable.id)).
                        exec();
    return prom;
  }


  /*
  =============================================================
    Movie Details CRUD API
  =============================================================
  */

  MF.get_all_movie_details = function() {
    return get_list(movieDetailsTable);
  }

  MF.get_movie_details = function(movie_id) {
    var prom = myflixDB.select().
            from(movieDetailsTable).
            where(movieDetailsTable.movie_id.eq(movie_id)).exec();
    return prom;
  }

  MF.add_movie_details = function(movie_details_attrs) {
    return add_row(movieDetailsTable, movie_details_attrs);
  }

  MF.delete_movie_details = function(movie_details_id) {
    return delete_row(movieDetailsTable, movie_details_id)
  }

  /*
  ==============================================================
    Creating collections
  ==============================================================
  */
  MF.group_movies_by_year = function() {    
    var distinctYearQuery = myflixDB.select(lf.fn.distinct(movieDetailsTable.release_year).as("year")).
                            from(movieDetailsTable);

    var distinctYearProm = distinctYearQuery.exec();

    distinctYearProm.then(function(data) {
      data.forEach(function(row) {
        var year = row.year.toString();
        var moviesInYearquery = myflixDB.select().
                                from(moviesTable).
                                innerJoin(movieDetailsTable, movieDetailsTable.movie_id.eq(moviesTable.id)).
                                where(movieDetailsTable.release_year.eq(row.year));
        var prom = moviesInYearquery.exec();
        prom.then(function(moviesData) {
          MF.moviesYearWise.push({year: row.year, movies: moviesData});
        });
      });
    });

    return distinctYearProm;
  }
 
  /*
  ==============================================================
    Private methods
  ==============================================================
   */
  function add_row(table_name, row_attrs) {
    var row = table_name.createRow(row_attrs);
    return myflixDB.insertOrReplace().into(table_name).values([row]).exec();
  }

  function delete_row(table_name, row_id) {
    return myflixDB.delete().from(table_name).where(table_name.id.eq(row_id)).exec();
  }

  function get_row(table_name, row_id) {
    var prom = myflixDB.select().
                        from(table_name).
                        where(table_name.id.eq(row_id)).exec();
    // prom.then(function(data) {
    //   console.log("select results ==> ", data);
    // });
    return prom; 
  }

  function get_list(table_name) {
    var prom = myflixDB.select().
                        from(table_name).
                        exec();
    // prom.then(function(data) {
    //   for (var i in data){
    //     console.log("select results ==> ", data[i]);
    //   }
    // });
    return prom;
  }

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
      .addColumn('parent_path', lf.Type.STRING)
      .addColumn('modification_date', lf.Type.DATE_TIME)
      .addColumn('file_size', lf.Type.NUMBER)
      .addColumn('file_extension', lf.Type.STRING)
      .addPrimaryKey(['id']);
      // .addIndex('idxFilename', ['filename'], false, lf.Order.DESC);

    myflixSchemaBuilder.createTable('movie_details')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('movie_id', lf.Type.INTEGER)
      .addColumn('rating', lf.Type.STRING)
      .addColumn('director', lf.Type.STRING)
      .addColumn('release_year', lf.Type.INTEGER)
      .addColumn('duration_mins', lf.Type.INTEGER)
      .addColumn('title', lf.Type.STRING)
      .addColumn('description', lf.Type.STRING)
      .addColumn('poster_url', lf.Type.STRING)
      .addColumn('type', lf.Type.STRING)
      .addColumn('release_date', lf.Type.DATE_TIME)
      .addPrimaryKey(['id']);

    myflixSchemaBuilder.createTable('movie_directories')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('directory_path', lf.Type.STRING)
      .addPrimaryKey(['id']);

    // Promise-based API to get the instance.
    myflixSchemaBuilder.connect().then(function(db) {
      console.log("db connection done");
      myflixDB = db;
      moviesTable = db.getSchema().table('movies');
      movieDetailsTable = db.getSchema().table('movie_details');
      movieDirectoriesTable = db.getSchema().table('movie_directories');
      // var actorsTable = db.getSchema().table('actors');
      console.log("db ==> ",db);
      console.log("myflixDB ==> ", myflixDB);
    });
  }

})(window.MF = window.MF || {}, jQuery, window);