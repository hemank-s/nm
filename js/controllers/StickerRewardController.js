(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        StickerRewardController = function(options) {
            this.template = require('raw!../../templates/stickerReward.html');
        };

    StickerRewardController.prototype.bind = function(App, data) {

        var that = this;

        console.log(data);

        // Sticker packs data here
        var stickerPacks = data.packs;
        var stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');

        that.assignStickerCatImages(stickerPacks, stickerDownloadRow);

        for (var i = 0; i < stickerDownloadRow.length; i++) {
            stickerDownloadRow[i].addEventListener('click', function(ev) {

                var stickerState = this.getAttribute('data-status');
                var catId = this.getAttribute('data-catId');
                var rewardId = this.getAttribute('data-rewardid');
                var stickerDetails = that.getStickerDetails(catId, stickerPacks);

                if (stickerState == '1') {
                    utils.showToast('You have already downloaded this sticker pack');
                } else {
                    console.log('Fetching sticker pack');
                    App.router.navigateTo('/stickerPackView', {"stickerDetails":stickerDetails ,"rewardId":rewardId});
                }
            });
        }

    };

    StickerRewardController.prototype.getStickerDetails = function(catId, stickerPacks) {


        for (var i = 0; i < stickerPacks.length; i++) {
            if (catId == stickerPacks[i].catId) {
                return stickerPacks[i];
            } else {
                console.log("Sticker Pack not found");
            }
        }

    };


    StickerRewardController.prototype.assignStickerCatImages = function(packs, rows) {

        var stickerCatUrl = 'http://54.169.82.65:5016/v1/stickerpack/';

        for (var i = 0; i < rows.length; i++) {
            var icon = rows[i].getElementsByClassName('stickerPackIcon')[0];
            console.log(icon);
            icon.style.backgroundImage = 'url(\'' + stickerCatUrl + packs[i].catId + '/preview' + '\')';

        }

    };

    StickerRewardController.prototype.render = function(ctr, App, data) {

        console.log(data);

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'stickerRewardContainer ftueController animation_fadein noselect';

        that.el.innerHTML = Mustache.render(that.template, {
            stickerPacks: data.rewardDetails.packs,
            title: data.rewardDetails.title,
            stitle: data.rewardDetails.stitle ,
            rewardId :data.rewardId           
        });

        data= data.rewardDetails;

        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    StickerRewardController.prototype.destroy = function() {

    };

    module.exports = StickerRewardController;

})(window, platformSdk, platformSdk.events);