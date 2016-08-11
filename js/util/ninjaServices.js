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
                'url': URL.api_location + '/profile?random='+Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);  
        },

        // Get complete Ninja List of Rewards That can be earned By Work
        getNinjaRewards : function(fn,x){
            var params = {
                'url': URL.api_location + '/rewards?random='+Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);  
        },

        // Get Ninja Acitivty/Stats for Lifetime :: 30 days :: 7 days 
        getNinjaActivity : function(fn, x){
            var params = {
                'url': URL.api_location + '/stats?random='+Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);  
        },

        // Get Speicifc Reward Details For The Reward Router
        getRewardDetails: function(data, fn, x) {
            console.log(data);
            var params = {
                'url': URL.api_location + '/rewards/'+data.rewardId+'?random='+Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },


        
        // Rewards Service For Ninja 

        // Activity Service For Ninja
    };

    module.exports = ninjaService;

})(window, platformSdk);
