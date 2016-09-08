(function() {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),

        expHandlerAB = function() {};

    expHandlerAB.prototype = {

        // Get From Disk Cache
        getVal: function(key, defaultVal, callback) {

            platformSdk.nativeReqAB({
                fn: 'getABTestBoolean',
                ctx: this,
                data: [key, defaultVal],
                success: callback
            });
        },
    };

    module.exports = new expHandlerAB();
})();