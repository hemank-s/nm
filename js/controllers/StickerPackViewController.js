(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        Config = require('../../config.js'),

        StickerPackViewController = function(options) {
            this.template = require('raw!../../templates/stickerPackView.html');
        };

    StickerPackViewController.prototype.bind = function(App, data) {

        var that = this;

        var downloadStickerPackButton = document.getElementsByClassName('downloadStickerPackButton')[0];
        var stickerRow = document.getElementsByClassName('stickerRow');
        var selectedSticker = document.getElementsByClassName('selectedSticker')[0];

        console.log(data);
        that.assignStickerPreviewImages(selectedSticker, data.act_stickers, stickerRow, data.catId);

        downloadStickerPackButton.addEventListener('click', function(ev) {
            console.log("Getting sticker pack for you");

            var dataToSend = {};

            //STUB
            //var data = {};
            
            /*data.rid = '57b56ec17e401ddfe70a9e8f';
            data.send = { 'catId': catId };*/
            //dataToSend.rid = "";
            dataToSend.rid  = this.getAttribute('data-rewardId');
            dataToSend.send  = { 'catId': data.catId };


            var stickerJSON = {'catId':data.catId,'categoryName':data.name,'totalStickers':data.nos,'categorySize':data.size}
            stickerJSON = JSON.stringify(stickerJSON);

            App.NinjaService.getStickerPack(dataToSend, function(res) {

               console.log("Inside actual function");     
                console.log(res);

                        
                if (res.stat == "ok") {
                   PlatformBridge.downloadStkPack(stickerJSON);
                   utils.showToast('You can view your sticker in the sticker palette. Start Sharing');

               } else {
                   utils.showToast("Can't download at right now!");
               }                   
                // App.router.navigateTo('/');
            }, this);

        });


    };

    StickerPackViewController.prototype.assignStickerPreviewImages = function(headerSticker, stickerList, rows, catId) {


        var stickerPreviewUrl = appConfig.API_URL + '/stickerpack/';

        // Header Sticker
        headerSticker.style.backgroundImage = 'url(\'' + stickerPreviewUrl + catId + '/preview' + '\')';

        for (var i = 0; i < rows.length; i++) {
            var icon = rows[i].getElementsByClassName('stickerIcon')[0];
            icon.style.backgroundImage = "url('" + appConfig.STICKER_PREFIX + "catId=" + catId + "&stId=" + stickerList[i] + appConfig.STICKER_SUFFIX + "')";
        }
    };

    StickerPackViewController.prototype.render = function(ctr, App, data) {

        console.log(data);

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'StickerPackViewController animation_fadein noselect';
        that.el.innerHTML = Mustache.render(that.template, {
            stickers: data.stickerDetails.act_stickers,
            rewardId : data.rewardId
        });

        data= data.stickerDetails;

        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    StickerPackViewController.prototype.destroy = function() {

    };

    module.exports = StickerPackViewController;

})(window, platformSdk, platformSdk.events);