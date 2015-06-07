'use strict';

angular.module('Downloader')
  .factory('DownloadService', function (SocketIOService) {
  	var downloadService = { downloads: [] };
    
    var field = document.getElementById("url");
    var button = document.getElementById("send");

    button.onclick = function() {
       	var text = field.value;
       	field.value = "";
       	console.log(text);
        download(text, generateFileName(text));
    };

    function download(uri, name){
    	if (uri != ""){
	    	var object = { uri: uri, name: name };
	    	downloadService.downloads.push(object);
	       	SocketIOService.download(downloadService.downloads);
       	}
    }
    
    function generateId(length) {
  		var arr = new Uint8Array((length || 40) / 2);
  		window.crypto.getRandomValues(arr);
  		return [].map.call(arr, function(n) { return n.toString(16); }).join("");
	}
    return downloadService; 

    function generateFileName(uri){
    	var re = /(?:\.([^.]+))?$/;
    	console.log(re.exec(uri));
    	return generateId(20) + re.exec(uri)[0];
    }
  });