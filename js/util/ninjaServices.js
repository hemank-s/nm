(function(W, platformSdk) {
    'use strict';

    var utils = require('./utils.js');
    var Constants = require('../../constants');
    var checkTimeout = null;

    var ninjaService = function(service) {
        this.ninjaService = service;
    };

    var URL = {
        subscription_location: appConfig.SUB_URL + '/subscription/api/v3/microapps/subscribe.json',
        unsubscription_location: appConfig.SUB_URL + '/subscription/api/v3/microapps/unsubscribe.json',
        api_location: appConfig.API_URL
    };

    ninjaService.prototype = {

        // Subscribe Call For Engine / Game
        subscribeCall: function(data, fn, x) {
            console.log(data);
            var params = {
                'url': URL.subscription_location,
                'type': 'POST',
                'data': data
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        // Unsubscribe CaLl For Ene Or Game
        unsubscribeCall: function(data, fn, x) {
            console.log(data);
            var params = {
                'url': URL.unsubscription_location,
                'type': 'POST',
                'data': data
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        // Profile Service For Ninja 

        getNinjaProfile: function(fn, x){
            var params = {
                'url': 'http://54.169.82.65:5016/v1/profile?random='+Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);  
        },

        getNinjaRewards : function(fn,x){
            var params = {
                'url': 'http://10.0.1.133:5016/v1/profile?random='+Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);  
        },

        getNinjaActivity : function(fn, x){
            var params = {
                'url': 'http://54.169.82.65:5016/v1/stats?random='+Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);  
        }
        
        // Rewards Service For Ninja 

        // Activity Service For Ninja
    };

    module.exports = ninjaService;

})(window, platformSdk);
