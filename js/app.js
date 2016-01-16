
var chooseDirectoryBtn = document.querySelector('#chooseDirectoryID');
var textarea = document.querySelector('textarea');

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

//Can improve this :(
	function sanitizeFilename(filename){
		return filename.replace(/(dvdrip|xvid| cd[0-9]|dvdscr|brrip|divx|[\{\(\[]?[0-9]{4}).*/g,"").replace(/\./g," ");
	}


//this can be improved!

function getFileExtension(filename){
	return filename.slice(filename.lastIndexOf('.'), filename.length).replace(".","");
}




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
    		if (!results.length) {
    			textarea.value = entries.join("\n");
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
                }

    						MF.add_movie(movie_attrs);

                moviesObjectArray.push(movie_attrs);
                id+=1;
    					});
    				};
    				console.log(item)
    				if (item.isDirectory){
    					console.log("DIRECTORY")
    					// Running the recursion here!
    					loadDirEntry(item);
    				}
    			});
    			readEntries();
    		}
    	}, errorHandler);
    };

    readEntries(); // Start reading dirs.  
    console.log("moviesObjectArray ===>", moviesObjectArray.length);
    for (var i in moviesObjectArray){
    	queryOmdb(moviesObjectArray[i].filename);
    }
  }
}


chooseDirectoryBtn.addEventListener('click', function(e) {
	console.log("click event ==> ", e);
	chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry, folderFiles) {
		if (!theEntry) {
			console.log("No directory selected");
			return;
		}
		console.log("theEntry ===> ", theEntry);
		console.log("folderFiles ===> ", folderFiles);
		loadDirEntry(theEntry);
	});
});

// setTimeout(function(){
//   MF.get_movies();
// }, 5000); 
