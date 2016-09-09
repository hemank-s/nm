(function() {
    'use strict';

    module.exports = {
        DEV_ENV: 'dev',
        STAGING_ENV: 'staging',
        PROD_ENV: 'prod',

        ConnectionTypes: {
            NO_NETWORK: '-1',
            UNKNOWN: '0',
            WIFI: '1',
            TWO_G: '2',
            THREE_G: '3',
            FOUR_G: '4'
        },

        Events: {
            NAVIGATE_APP: 'app.navigate',
            TOGGLE_BLOCK: 'app.menu.om.block',
            RESET_APP: 'app.reset'
        },

        // Levels 0- Bronze; 1-Silver; Gold-2

        REWARD_STATE: {

            LOCKED: "0",
            UNLOCKED: "1",
            INPROGRESS: "2",
            REDEEMED: "3",
            FAILED: "4",
            EXPIRED: "5"
        }
    };

})();