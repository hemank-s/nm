(function() {
    'use strict';

    var Constants = require('./constants');

    module.exports = function(env) {
        if (env === Constants.DEV_ENV) {
            return {
                API_URL: 'http://54.169.82.65:5016/v1',
                LOG_URL: 'http://54.169.82.65:5016/v1',
                STICKER_PREFIX: "http://staging.im.hike.in/sticker?",
                STICKER_SUFFIX: "&resId=LDPI&image=true"

            };
        } else if (env === Constants.STAGING_ENV) {
            return {
                API_URL: 'http://54.169.82.65:5016/v1',
                LOG_URL: 'http://54.169.82.65:5016/v1',
                STICKER_PREFIX: "http://staging.im.hike.in/sticker?",
                STICKER_SUFFIX: "&resId=LDPI&image=true"

            };
        } else if (env === Constants.PROD_ENV) {
            return {
                API_URL: 'http://54.169.82.65:5016/v1',
                LOG_URL: 'http://54.169.82.65:5016/v1',
                STICKER_PREFIX: "http://staging.im.hike.in/sticker?",
                STICKER_SUFFIX: "&resId=LDPI&image=true"
            };
        }

        return {};
    };
})();