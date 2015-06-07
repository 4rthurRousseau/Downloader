'use strict';
angular.module('Downloader')
    .controller('DownloadController',  function ($scope, SocketIOService, DownloadService) {
    this.downloads = DownloadService.downloads;

    SocketIOService.onDownloadEnded(function(response){
        $scope.$apply();
        $scope.$emit('reload');
    }.bind(this));

    this.download = function(uri) {
      DownloadService.download(uri);
    }.bind(this);
  }
);
