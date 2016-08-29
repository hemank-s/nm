/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),
        utils = require('../util/utils'),
        cacheProvider = require('../util/cacheProvider'),
        TxService = require('../util/txServices'),
        NinjaService = require('../util/ninjaServices'),

        MysteryBoxModel = function() {
            this.TxService = new TxService();
            this.NinjaService = new NinjaService(this.TxService); //communication layer
        },

        EMPTY_OBJ_READ_ONLY = {};

    MysteryBoxModel.prototype = {

        getMysteryBoxDetails: function(App) {

            // Active :: Can Spin The Wheel and Earn Some Gift

            // Inactive :: The Wheel is Not Available as of now

            // Under Cooldown :: The spinning has been done and under cooldown period

            // STUB TO REMOVE

            // var res1 = { 'data': { 'status': 'active', 'rewards': [{ 'id': 1, 'type': 'mysteryBox_medium', 'title': 'Battery + 1' }, { 'id': 2, 'type': 'mysteryBox_medium', 'title': 'Streak + 1' }, { 'id': 3, 'type': 'mysteryBox_low', 'title': 'Battery + 0' }, { 'id': 4, 'type': 'mysteryBox_low', 'title': 'Streak + 0' }, { 'id': 5, 'type': 'mysteryBox_bumper', 'title': 'Custom sticker' }, { 'id': 6, 'type': 'mysteryBox_low', 'title': 'Battery - 1' }, { 'id': 7, 'type': 'mysteryBox_low', 'title': 'streak - 1' }, { 'id': 8, 'type': 'mysteryBox_low', 'title': 'Better Luck next time' }] } };
            // var res2 = { 'data': { 'status': 'inactive', 'rewards': [], 'streakToUnlock': 14 } };
            // var res3 = { 'data': { 'status': 'cooldown', 'rewards': [], 'coolDownTime': 1470916209263 } };

            // this.updateMysteryBoxTab(res1.data, App);

            // STUB TO REMOVE

            App.NinjaService.getMysteryBox(function(res) {
                console.log("MYSTERY BOX DATA IS", res.data);
                this.updateMysteryBoxTab(res.data, App);
            }, this);

        },

        getMysteryBoxRewardDetails: function(data, rId) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].id == rId) {
                    console.log("Match found", data[i]);
                    return data[i];
                } else {
                    console.log("Reward not found");
                }
            }
        },

        defineMysteryBoxResultAnimation: function(App, rewardData) {

            var mysteryBoxContainer = document.getElementsByClassName('mysteryBoxContainer')[0]; // Gives Existing List of Rewards in the Template
            //mysteryBoxContainer.innerHTML = '';

            if (rewardData.value == 'HIGH') {
                console.log("Bumper Anmation");
                this.template = require('raw!../../templates/mysteryBoxResultAnimation.html');
                mysteryBoxContainer.innerHTML = Mustache.render(this.template, {
                    mysterBoxReward: rewardData
                });

                var mysteryRewardBumperAction = document.getElementsByClassName('mysteryRewardBumperAction')[0];
                mysteryRewardBumperAction.addEventListener('click', function() {
                    var res = { 'data': { 'rewardId': 112321, 'customStickers': [{ "id": 123, "ts": 1470916209781, "status": "inProgress", "phrase": "Not a blocker", "url": "http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png" }, { "id": 124, "ts": 1470916209224, "status": "completed", "phrase": "It is a blocker", "url": "http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png" }], 'eligible': true } };
                    App.router.navigateTo('/customSticker', res.data);
                });

            } else if (rewardData.type == 'LOW') {
                console.log("Low animation :: Figure Out design");
            } else if (rewardData.type == 'MED') {
                console.log("Low animation :: Figure Out Design");
            }
        },

        mapRewardsToSlice: function(mysteryBoxData){
            console.log(mysteryBoxData);

            var slices = document.getElementsByClassName('part');

            for (var i=0; i< slices.length; i++){
                console.log(slices);
                slices[i].setAttribute('data-reward',mysteryBoxData.rewards[i].id); 
            }
            // Set Icons here as well
        },

        getRewardMapping: function(resultId, mysteryBoxData){

            var slices = document.getElementsByClassName('part');

            for (var i=0; i< slices.length; i++){
                var result = slices[i].getAttribute('data-reward');

                if(result == resultId){
                    var winner = slices[i].getAttribute('data-slice');
                    return winner;
                }else {
                    console.log("No reward Found");
                }
            }
        },

        defineLuckyBox: function(App, mysteryBoxData) {

            var that = this;
            
            // Result of Spin
            var spinResult = that.getRewardMapping(mysteryBoxData.spin_result.id, mysteryBoxData);
            var rewardData = mysteryBoxData.spin_result;
            // Define Wheel

            var spin = document.getElementById('spin');
            var wheel = document.getElementById('wheel');
            var result = document.getElementById('result');

            var setText = function(a, b, c) {
                a.addEventListener('transitionend', function() {
                    b.innerText = rewardData.title;
                    that.defineMysteryBoxResultAnimation(App, rewardData);
                    a.removeEventListener('transitionend', setText);
                });
            };

            var deg = 0;
            var rotations = 0;

            spin.addEventListener('click', function() {
                rotations++;
                var stop = spinResult;
                console.log('stop is', stop);
                var rotationFix = 360 / 16 + 360 / 8 + rotations * 720;
                deg = 360 / 8 * stop + rotationFix;
                var rot = 'rotate3d(0,0,1,' + deg + 'deg)';
                wheel.style.transform = rot;
                setText(wheel, result, rewardData);
            });

        },

        defineCooldown: function(spinTime) {

            function getTimeRemaining(timeRemaining) {
                var t = timeRemaining;
                var seconds = Math.floor((t / 1000) % 60);
                var minutes = Math.floor((t / 1000 / 60) % 60);
                var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
                var days = Math.floor(t / (1000 * 60 * 60 * 24));
                return {
                    'total': t,
                    'days': days,
                    'hours': hours,
                    'minutes': minutes,
                    'seconds': seconds
                };
            }

            function initializeClock(id, timeRemaining) {
                var clock = document.getElementById(id);
                var daysSpan = clock.querySelector('.days');
                var hoursSpan = clock.querySelector('.hours');
                var minutesSpan = clock.querySelector('.minutes');
                var secondsSpan = clock.querySelector('.seconds');

                function updateClock() {
                    var t = getTimeRemaining(timeRemaining);

                    daysSpan.innerHTML = t.days;
                    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

                    if (t.total <= 0) {
                        clearInterval(timeinterval);
                    }
                }

                updateClock();
                var timeinterval = setInterval(updateClock, 1000);
            }

            var d = new Date(spinTime); // The 0 there is the key, which sets the date to the epoch

            var deadline = d;
            initializeClock('clockdiv', deadline);

        },

        updateMysteryBoxTab: function(mysteryBoxData, App) {

            var mysteryBoxContainer = document.getElementsByClassName('mysteryBoxContainer')[0]; // Gives Existing List of Rewards in the Template
            mysteryBoxContainer.innerHTML = '';
            console.log(mysteryBoxData);

            if (mysteryBoxData.mstatus == 'inactive') {

                // Re Render The Reward Template Only From External HTML
                this.template = require('raw!../../templates/mysteryBoxInactiveTemplate.html');
                mysteryBoxContainer.innerHTML = Mustache.render(this.template, {
                    streakToUnlock: mysteryBoxData.streak_unlock
                });
            } else if (mysteryBoxData.mstatus == 'active') {

                this.template = require('raw!../../templates/mysteryBoxActiveTemplate.html');
                mysteryBoxContainer.innerHTML = Mustache.render(this.template, {});
                this.mapRewardsToSlice(mysteryBoxData);
                this.defineLuckyBox(App, mysteryBoxData);

            } else if (mysteryBoxData.mstatus == 'cooldown') {

                console.log(mysteryBoxData);

                this.template = require('raw!../../templates/mysteryBoxCooldownTemplate.html');
                mysteryBoxContainer.innerHTML = Mustache.render(this.template, {});

                this.defineCooldown(mysteryBoxData.coolDownTime);

            } else {
                console.log('Add a default state here Later');
            }

        }

    };

    module.exports = new MysteryBoxModel();
})();
