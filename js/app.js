var chooseDirectoryBtn = document.querySelector('#chooseDirectoryID');
var textarea = document.querySelector('textarea');

function errorHandler(e) {
  console.error(e);
}

function loadDirEntry(_chosenEntry) {
  console.log("loadDirEntry called")
  chosenEntry = _chosenEntry;
  if (chosenEntry.isDirectory) {
    var dirReader = chosenEntry.createReader();
    var entries = [];

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {
      console.log("reading entries");
       dirReader.readEntries (function(results) {
        console.log("results ==> ", results);
        if (!results.length) {
          textarea.value = entries.join("\n");
        } 
        else {
          results.forEach(function(item) { 
            entries = entries.concat(item.fullPath + "isDirectory ===> " + item.isDirectory);
          });
          readEntries();
        }
      }, errorHandler);
    };

    readEntries(); // Start reading dirs.    
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