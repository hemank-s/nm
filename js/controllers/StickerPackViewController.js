(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        StickerPackViewController = function(options) {
            this.template = require('raw!../../templates/stickerPackView.html');
        };

    StickerPackViewController.prototype.bind = function(App, data) {

        var that = this;

        var downloadStickerPackButton = document.getElementsByClassName('downloadStickerPackButton')[0];
        var stickerRow= document.getElementsByClassName('stickerRow');
        var selectedSticker = document.getElementsByClassName('selectedSticker')[0];

        console.log(data);
        that.assignStickerPreviewImages(selectedSticker,data.act_stickers,stickerRow,data.catId);

        downloadStickerPackButton.addEventListener('click', function(ev) {
            console.log("Getting sticker pack for you");
            
            var catId = this.getAttribute('data-catid');
            console.log(catId);


            var data ={};
            data.rid = '57b56ec17e401ddfe70a9e8f';
            data.send = {'catId':catId};

            App.NinjaService.getStickerPack(data, function(res) {
                console.log(res);
                utils.showToast('You can view your sticker in the sticker palette. Start Sharing');
                // App.router.navigateTo('/');
            }, this);

        });


    };

    StickerPackViewController.prototype.assignStickerPreviewImages = function(headerSticker,stickerList,rows,catId){
        
        var stickerPreviewUrl = 'http://54.169.82.65:5016/v1/stickerpack/';

        // Header Sticker
        headerSticker.style.backgroundImage = 'url(\'' + stickerPreviewUrl+catId+'/'+stickerList[0]+'/preview' + '\')';


        for (var i = 0; i < rows.length; i++) {
            var icon = rows[i].getElementsByClassName('stickerIcon')[0];
            icon.style.backgroundImage = 'url(\'' + stickerPreviewUrl+catId+'/'+stickerList[i]+'/preview' + '\')';

        }
    };

    StickerPackViewController.prototype.render = function(ctr, App, data) {

        console.log(data);

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'StickerPackViewController animation_fadein noselect';
        that.el.innerHTML = Mustache.render(that.template, {
            stickers: data.act_stickers,
            catId: data.catId
        });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    StickerPackViewController.prototype.destroy = function() {

    };

    module.exports = StickerPackViewController;

})(window, platformSdk, platformSdk.events);
