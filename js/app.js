var screenWidth = screen.availWidth;
var screenHeight = screen.availHeight;
var width = 500;
var height = 300;

var chooseDirectoryBtn = document.querySelector('#chooseDirectoryID');
var textarea = document.querySelector('textarea');
var yearCollectionLink = document.querySelector("#moviesCollectionByYearID");
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
                textarea.value = entries.join("\n");
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


chooseDirectoryBtn.addEventListener('click' , function(e) {
	console.log("click event ==> ", e);
	chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry, folderFiles) {
		if (!theEntry) {
			console.log("No directory selected");
			return;
		}
		console.log("theEntry ===> ", theEntry);
		console.log("folderFiles ===> ", folderFiles);
        console.log("I reach here!!")        
        // setTimeout(function(){
        //     console.log("This is to check for moviesObjectArray == >", moviesObjectArray.length);
        // }, loadDirEntry(theEntry)); 

        loadDirEntry(theEntry);

        setTimeout(function(){
            fetchMovieDetailsFromOMDB(); 
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

