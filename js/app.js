var screenWidth = screen.availWidth;
var screenHeight = screen.availHeight;
var width = 500;
var height = 300;

var chooseDirectoryBtn = document.querySelector('#chooseDirectoryID');
var textarea = document.querySelector('textarea');
var yearCollectionLink = document.querySelector("#moviesCollectionByYearID");
var loadingMessageDiv = document.querySelector("#loading-msg");
// var yearCollectionLink = document.querySelector("#moviesCollectionByYearID");

function errorHandler(e) {
	console.error(e);
}

var entries = []

// var Movie = class {
// 	constructor(filename, filePath, parent ){
// 		this.filename = filename;
// 		this.filePath = filePath;
// 		this.parent = parent;
// 	}
// }

var moviesObjectArray = []
var id = 0;
var extensions = ["mp4","avi","mkv"];


//Can improve this :(
	function sanitizeFilename(filename){
		return filename.replace(/(dvdrip|xvid| cd[0-9]|dvdscr|brrip|divx|[\{\(\[]?[0-9]{4}).*/g,"").replace(/\./g," ");
	}


//this can be improved!

function getFileExtension(filename){
	return filename.slice(filename.lastIndexOf('.'), filename.length).replace(".","");
}



var test = 0;
function loadDirEntry(_chosenEntry) {
	console.log("loadDirEntry called")
	chosenEntry = _chosenEntry;
	if (chosenEntry.isDirectory) {
		var dirReader = chosenEntry.createReader();
		// var entries = [];
        // Call the reader.readEntries() until no more results are returned.
        var readEntries = function() {
    	   console.log("reading entries");
    	   dirReader.readEntries (function(results) {
            console.log("YOOOO");
            console.log(results);
            if (results == "") {
                console.log("I am empty")
                
            }
    		if (!results.length) {
                // textarea.value = entries.join("\n");
                // console.log(test);
                // test+=1;
                return;
    		  } 
    		  else {
    		      	results.forEach(function(item) { 
    			     	entries = entries.concat(item.fullPath + " isDirectory ===> " + item.isDirectory + "\n " + sanitizeFilename(item.name) + "\n");
    				    //creating a Movie object
    				    if (!item.isDirectory){
    					   // console.log(item);
    					   item.getMetadata(function(metadata) { 
    						  // console.log("metadata ==> ", metadata); 
                                var movie_attrs = {
                                    id: id,
                                    filename: sanitizeFilename(item.name),
                                    file_path: item.fullPath,
                                    parent_path: _chosenEntry.fullPath,
                                    file_size: metadata.size/1024,
                                    modification_date: metadata.modificationTime,
                                    file_extension: getFileExtension(item.name)
                                };
                                if (extensions.indexOf(movie_attrs.file_extension) >= 0){
                                    console.log(movie_attrs);
                                    console.log(moviesObjectArray.length);
                                    moviesObjectArray.push(movie_attrs);
                                    MF.add_movie(movie_attrs);
                                    id+=1;
                                }
    					   });
    				    };
    				    console.log(item)
    				    if (item.isDirectory){
    					   console.log("DIRECTORY")
    					   //Running the recursion here!
    					   loadDirEntry(item);
    				    }

                    });
                    readEntries();
                    
    			
            }
    	}, errorHandler);
    };
    //Start reading directories
    readEntries();
    }
}

function fetchMovieDetailsFromOMDB() {

  console.log("moviesObjectArray ===>", moviesObjectArray.length);
  // for (var i = 0; i < moviesObjectArray.length; i++){
  //       queryOmdb(moviesObjectArray[i].filename);
  // }

  var prom = MF.get_movies();
  prom.then(function(data){
    var queryApi = setInterval(loop,3000);
    var i = 0
    function loop(){
        if (i >= data.length) {
            console.log("I reach here");
            clearInterval(queryApi);
            return;
        }
        queryOmdb(data[i].filename,data[i].id);
        i+=1;
    }
  });

  // var testing = setInterval(loop,3000);
  //   var i = 0
  //   function loop(){
  //       if (i >= moviesObjectArray.length) {
  //           console.log("I reach here");
  //           clearInterval(testing);
  //           return;
  //       }
  //       queryOmdb(moviesObjectArray[i].filename);
  //       i+=1;
  //   }

}

function add_poster_image(index, poster_url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', poster_url, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    var img = document.createElement('img');
    img.src = window.URL.createObjectURL(this.response);
    $("#movie-id-"+index).find("img").replaceWith(img);
    // document.body.appendChild(img);
  };

  xhr.send();
}

function show_movies_on_main_page(movies) {
  var movie_list_container = document.querySelector("#movie-list-container");
  movies.forEach(function(obj, index) {
    var movie_line_id = index/3;
    console.log("INDEX ==========================> ", index);
    if (index%3 == 0) {
      // 
      var movie_html_div_template_str = '<div class="row movie-line" id="movie-line-id-'+movie_line_id+'">' +
                                      '<div class="col-md-4" id="movie-id-'+index+'" >' +
                                        '<div class="item card">' +
                                          '<img src="'+ obj.movie_details.poster_url +'" alt="">' +
                                          '<div class="info">' +
                                            '<div class="row">' +
                                              '<div class="col-md-8 title">'+ obj.movie_details.title +' <span class="font-normal">('+ obj.movie_details.release_year +')</span></div>' +
                                              '<div class="col-md-4 duration text-right"> '+ obj.movie_details.duration_mins+'</div>' +
                                            '</div>' +
                                            '<div class="row">' +
                                              '<div class="col-md-8 rating-star">***</div>' +
                                              '<div class="col-md-4 rating text-right">'+obj.movie_details.rating+'/10</div>' +
                                            '</div>' +
                                            '<div class="row">' +
                                              '<div class="col-md-12 tags">Action, Crime, Sci-Fi</div>' +
                                            '</div>' +
                                          '</div>' +
                                        '</div>' +
                                      '</div>'
                                    '</div>';

      $(movie_list_container).append(movie_html_div_template_str);
      add_poster_image(index, obj.movie_details.poster_url);

    } else {
      console.log("obj ===>", obj);
      var movie_html_template_str = '<div class="col-md-4" id="movie-id-'+index+'">' +
                                      '<div class="item card">' +
                                        '<img src="'+ obj.movie_details.poster_url +'" alt="">' +
                                        '<div class="info">' +
                                          '<div class="row">' +
                                            '<div class="col-md-8 title">'+ obj.movie_details.title +' <span class="font-normal">('+ obj.movie_details.release_year +')</span></div>' +
                                            '<div class="col-md-4 duration text-right"> '+ obj.movie_details.duration_mins+'</div>' +
                                          '</div>' +
                                          '<div class="row">' +
                                            '<div class="col-md-8 rating-star">***</div>' +
                                            '<div class="col-md-4 rating text-right">'+obj.movie_details.rating+'/10</div>' +
                                          '</div>' +
                                          '<div class="row">' +
                                            '<div class="col-md-12 tags">Action, Crime, Sci-Fi</div>' +
                                          '</div>' +
                                        '</div>' +
                                      '</div>' +
                                    '</div>';


      console.log("trying to get the movie line container");
      movie_list_line_container = $("#movie-line-id-"+Math.floor(movie_line_id));
      console.log("movie_list_line_container", movie_list_line_container)
      movie_list_line_container.append(movie_html_template_str);
      add_poster_image(index, obj.movie_details.poster_url);
    };
  });
}

function load_main_page_from_dir_selector_page() {
   var prom = MF.get_movies_w_details();

   prom.then(function(data) {
    console.log("get movies o/p =>", data);
    document.querySelector("#directory-selector-page").style.display = "none";
    document.querySelector("#main-page").style.display = "block";

    show_movies_on_main_page(data);
   });
}


chooseDirectoryBtn.addEventListener('click' , function(e) {
	// console.log("click event ==> ", e);
	chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry, folderFiles) {
		if (!theEntry) {
			console.log("No directory selected");
			return;
		}
		// console.log("theEntry ===> ", theEntry);
		// console.log("folderFiles ===> ", folderFiles);
        // console.log("I reach here!!")        

        // setTimeout(function(){
        //     console.log("This is to check for moviesObjectArray == >", moviesObjectArray.length);
        // }, loadDirEntry(theEntry)); 

        console.log("theEntry", theEntry);

        loadingMessageDiv.innerHTML = "Storing movie directory location...";
        MF.add_movie_directory(theEntry.fullPath);

        loadingMessageDiv.innerHTML = "Reading movies from directory...";
        loadDirEntry(theEntry);

        loadingMessageDiv.innerHTML = "Fetching data from API...";
        setTimeout(function(){
          fetchMovieDetailsFromOMDB(); 
          load_main_page_from_dir_selector_page()
        },10000);
        

	});
});

yearCollectionLink.addEventListener('click' , function(e) {
  console.log("yearCollectionLink click event ==> ", e);
  document.querySelector("#main-page").style.display = "none";
  document.querySelector("#list-page").style.display = "block";
});



// setTimeout(function(){
//   MF.get_movies();
// }, 5000); 

