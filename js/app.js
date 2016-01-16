var chooseDirectoryBtn = document.querySelector('#chooseDirectoryID');
chooseDirectoryBtn.addEventListener('click', function(e) {
  console.log("click event ==> ", e);
  chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry) {
    console.log("The shit worked");
  });
});