(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        CustomerStickerController = function(options) {
            this.template = require('raw!../../templates/customSticker.html');
        };

    CustomerStickerController.prototype.bind = function(App, data) {

        var that = this;

        // All Custom Sticker Views Defined

        // Main views
        var customStickerUploadScreen = document.getElementsByClassName('customStickerUploadScreen')[0];
        var customStickerFtueWrapper = document.getElementsByClassName('customStickerFtueWrapper')[0];

        // Subsequent Views
        var customStickerSent = document.getElementsByClassName('customStickerSent')[0];
        var customStickerStatusCheck = document.getElementsByClassName('customStickerStatusCheck')[0];
        var customStickerReadyState = document.getElementsByClassName('customStickerReadyState')[0];

        // All Custom Sticker Actions

        var uploadPhoto = document.getElementsByClassName('uploadPhotoContainer')[0];
        var customStickerButton = document.getElementsByClassName('customStickerButton')[0];
        var customStickerFaq = document.getElementsByClassName('customStickerFaq')[0];

        if (data.customStickers.length > 0) {
            console.log("The user is not new to custom Sticker");
            utils.removeClass(customStickerUploadScreen, 'hideClass');
        } else {
            console.log("First Time user");
            utils.removeClass(customStickerFtueWrapper, 'hideClass');
        }

        that.defineCustomStickerHistory(data.customStickers);

        // FAQ URL CLICK EVENT
        customStickerFaq.addEventListener('click', function(ev) {
            utils.openWebView(data.faqUrl);
        });

        // Show Upload Screen
        customStickerButton.addEventListener('click', function(ev) {
            console.log("Starting Custom Sticker");
            utils.addClass(customStickerFtueWrapper, 'hideClass');
            utils.removeClass(customStickerUploadScreen, 'hideClass');
        });

        customStickerFaq.addEventListener('click', function(ev) {
            that.uploadCustomStickerImage();
        });        


    };

    CustomerStickerController.prototype.defineCustomStickerHistory = function(stickers) {

        // All Custom Sticker History 
        var allCustomStickers = document.getElementsByClassName('customStickerIcon');

        console.log(stickers);

        for (var i = 0; i < stickers.length; i++) {
            if (stickers[i].url) {
                allCustomStickers[i].style.backgroundImage = "url('" + stickers[i].url + "')";
            } else {
                console.log("Sticker Icon is not present, please try a default icon");
            }
            if (stickers[i].ts) {
                var timestamp = new Date(stickers[i].ts);
                stickers[i].ts = timestamp.getDate() + '/' + timestamp.getMonth() + '/' + timestamp.getYear();
            } else {
                sticker[i].ts = 'Order date is unavailable';
            }
            
        }

    };

    CustomerStickerController.prototype.convertTimeStamp = function(stickers) {

        for (var i = 0; i < stickers.length; i++) {
            if (stickers[i].ts) {
                var timestamp = new Date(stickers[i].ts);
                stickers[i].ts = timestamp.getDate() + '/' + timestamp.getMonth() + '/' + timestamp.getYear();
            } else {
                sticker[i].ts = 'Order date is unavailable';
            }
        }
    };

    CustomerStickerController.prototype.uploadCustomStickerImage = function() {

        
    };

    CustomerStickerController.prototype.render = function(ctr, App, data) {

        console.log(data);

        var that = this;
        that.customStickersList = [];

        if (data) {
            that.customStickersList = data.customStickers;
            that.convertTimeStamp(data.customStickers);
        }

        console.log(that.customStickersList);

        that.el = document.createElement('div');
        that.el.className = 'customStickerContainer centerToScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(that.template, {
            customStickersList: that.customStickersList,
            newStickerEligibility: data.eligible
        });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomerStickerController.prototype.destroy = function() {

    };

    module.exports = CustomerStickerController;

})(window, platformSdk, platformSdk.events);
