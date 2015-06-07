'use strict';
angular.module('Downloader')
	.factory('SocketIOService', ['io', '_', '$timeout', function (io, _, $timeout) {
		var socket = io();
		var _onFileChanged = _.noop;
		var _onVisibilityStatesChanged = _.noop;

		socket.on('connect', function () {
			console.log('connected'); // @todo display it on screen using a notifier
		});

		socket.on('file:changed', function (filename, timestamp, content) {
			$timeout(function () {
				_onFileChanged(filename, timestamp, content);
			});
		});

		socket.on('users:visibility-states', function (states) {
			$timeout(function () {
				_onVisibilityStatesChanged(states);
			});
		});

		socket.on('error:auth', function (err) {
			// @todo yeurk
			alert(err);
		});

		socket.on('download:progress', function(object){
			console.log("Progress : " + object.progress);
		});

		socket.on('download:completed', function(object){
			console.log("Completed : " + object);
		});

		socket.on('download:error', function(object){
			console.log("Error : " + object);
		});

		return {
			onFileChanged: function (f) {
				_onFileChanged = f;
			},

			onVisibilityStatesChanged: function (f) {
				_onVisibilityStatesChanged = f;
			},

			download: function(downloads){
				socket.emit('download', downloads);
			},

			onDownloadEnded: function(f){

			},

			onDownloadError: function(f){

			},

			userChangedState: function (state) {
				socket.emit('user-visibility:changed', state);
			}
		};
	}]);