'use strict';
angular.module('Downloader')
  .factory('VisibilityService', ['Visibility', 'SocketIOService',
    function (Visibility, SocketIOService) {
      Visibility.change(function (evt, state) {
        // state === 'hidden' || 'visible'
        SocketIOService.userChangedState(state);
      });

      SocketIOService.userChangedState('visible');

      var service = {
        states: {}
      };

      SocketIOService.onVisibilityStatesChanged(function (states) {
        service.states = states;
      });

      return service;
    }
  ]);
