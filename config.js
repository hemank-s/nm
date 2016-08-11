(function() {
    'use strict';

    var Constants = require('./constants');

    module.exports = function(env) {
        if (env === Constants.DEV_ENV) {
            return {
                API_URL: 'http://54.169.82.65:5016/v1',
                LOG_URL:'http://54.169.82.65:5016/v1',

            };
        } else if (env === Constants.STAGING_ENV) {
            return {
                API_URL: 'http://54.169.82.65:5016/v1',
                LOG_URL:'http://54.169.82.65:5016/v1',

            };
        } else if (env === Constants.PROD_ENV) {
            return {
                API_URL: 'http://54.169.82.65:5016/v1',
                LOG_URL:'http://54.169.82.65:5016/v1',
            };
        }

        return {};
    };
})();