'use strict';
module.exports = function (logger) {
  var env = require('common-env')(logger);

  return env.getOrElseAll({
		server: {
			exposed_endpoint: 'http://127.0.0.1:3000',
			port: 3000
		}
	});
};
