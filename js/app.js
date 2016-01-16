
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
    		// console.log("results ==> ",results.length);
    		// console.log("results ==> ",results);


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
    						console.log("metadata ==> ", metadata); 
    						moviesObjectArray.push({
    							filename: sanitizeFilename(item.name),
    							fullPath: item.fullPath,
    							parentPath: _chosenEntry.fullPath,
    							size: metadata.size/1024,
    							modificationDate: metadata.modificationTime,
    							fileExtension: getFileExtension(item.name)
    						});
    					});
    					
    				}
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

setTimeout(function(){
  MF.get_movies();
}, 1000); 
