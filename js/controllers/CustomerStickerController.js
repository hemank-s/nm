(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        customImageUploaded = false,
        uploadCustomStickerData = {},

        CustomStickerController = function(options) {
            this.template = require('raw!../../templates/customSticker.html');
        };

    CustomStickerController.prototype.bind = function(App, data) {

        var that = this;
        console.log("data is",data);
        var rewardId = data.rewardId;

        // All Custom Sticker Views Defined

        // Main views
        var customStickerUploadScreen = document.getElementsByClassName('customStickerUploadScreen')[0];
        var customStickerFtueWrapper = document.getElementsByClassName('customStickerFtueWrapper')[0];

        // Subsequent Views
        var customStickerSent = document.getElementsByClassName('customStickerSent')[0];
        var customStickerStatusCheck = document.getElementsByClassName('customStickerStatusCheck')[0];
        var customStickerReadyState = document.getElementsByClassName('customStickerReadyState')[0];
        var customStickerRow = document.getElementsByClassName('customStickerRow');

        var customStickerImage = document.getElementsByClassName('uploadPhotoContainer')[0];

        //var profilePicLoader = document.getElementById('profilePicLoader');
        var errorMessage = document.getElementsByClassName('errorMessage')[0];
        var customStickerTextPhrase = document.getElementById('customStickerTextPhrase');
        var textLanguage = document.getElementById('textLanguage');
        var sendButton = document.getElementsByClassName('sendButton')[0];

        // All Custom Sticker Actions

        var uploadPhoto = document.getElementsByClassName('uploadPhotoContainer')[0];
        var customStickerButton = document.getElementsByClassName('customStickerButton')[0];
        var customStickerFaq = document.getElementsByClassName('customStickerFaq')[0];
        var customStickerShareAction = document.getElementsByClassName('customStickerShareAction')[0];

        if (data.customStickers.length > 0) {
            console.log('The user is not new to custom Sticker');
            utils.removeClass(customStickerUploadScreen, 'hideClass');
        } else {
            console.log('First Time user');
            utils.removeClass(customStickerFtueWrapper, 'hideClass');
        }

        that.defineCustomStickerHistory(data.customStickers);

        // Event Definations

        // FAQ URL CLICK EVENT
        customStickerFaq.addEventListener('click', function(ev) {
            utils.openWebView(data.faqUrl);
        });

        // Show Upload Screen After the First Time
        customStickerButton.addEventListener('click', function(ev) {
            utils.addClass(customStickerFtueWrapper, 'hideClass');
            utils.removeClass(customStickerUploadScreen, 'hideClass');
        });

        // Choose Sticker Image From gallery
        customStickerImage.addEventListener('click', function(ev) {
            utils.removeClass(errorMessage, 'hideClass');
            that.chooseStickerImageFromGallery();
        });

        // Send the Data to Server
        sendButton.addEventListener('click', function(ev) {
            that.sendCustomStickerDataToServer();
        });

        customStickerShareAction.addEventListener('click', function(ev) {
            
            var customStickerId = this.getAttribute('data-id');

            that.sendCustomStickerToUser(App,rewardId,customStickerId);
        });

        that.defineCustomStickerClick(customStickerRow, data.customStickers);

    };


    CustomStickerController.prototype.sendCustomStickerToUser = function(App,rewardId,customStickerId) {

        console.log("Sending the custom sticker to the user via packet");

        console.log(rewardId);
        console.log(customStickerId);

        var data ={};
        data.rewardId = rewardId;
        data.customStickerId = customStickerId;

        // Reward Details API :: Send Reward Id As well
        App.NinjaService.sendCustomSticker(data, function(res) {
            // Show Toast if Success
            console.log(res);
            utils.showToast('You will receive your sticker via the team hike bot shortly, start sharing.');
            // Routing to the specific Router
            //App.router.navigateTo(rewardRouter, res.data);
        }, this);



    };

    CustomStickerController.prototype.defineCustomStickerClick = function(customStickerRow, data) {

        var customStickerUploadScreen = document.getElementsByClassName('customStickerUploadScreen')[0];
        var customStickerFtueWrapper = document.getElementsByClassName('customStickerFtueWrapper')[0];

        // Subsequent Views
        var customStickerSent = document.getElementsByClassName('customStickerSent')[0];
        var customStickerStatusCheck = document.getElementsByClassName('customStickerStatusCheck')[0];
        var customStickerReadyState = document.getElementsByClassName('customStickerReadyState')[0];
        var customStickerView = document.getElementsByClassName('customStickerView')[0];

        for (var i = 0; i < customStickerRow.length; i++) {
            customStickerRow[i].addEventListener('click', function(event) {

                var state = this.getAttribute('data-status');
                var id = this.getAttribute('data-id');
                var url = this.getAttribute('data-url');

                if (state == 'completed') {
                    console.log("Take To Success Page :: Send Image and ID There Reference");
                    utils.removeClass(customStickerReadyState, 'hideClass');
                    utils.addClass(customStickerUploadScreen, 'hideClass');
                    utils.addClass(customStickerSent, 'hideClass');
                    utils.addClass(customStickerFtueWrapper, 'hideClass');

                    // Set Id Attribute For Reference Later
                    var customStickerShareAction = document.getElementsByClassName("customStickerShareAction")[0];
                    var att = document.createAttribute("data-id");
                    att.value = id;
                    customStickerShareAction.setAttributeNode(att);

                    // Set Background Image Of Sticker Being Set
                    customStickerView.style.backgroundImage = 'url(\'' + url + '\')';


                } else if (state == 'inProgress') {
                    console.log("Take to status Check Page :: Send ID");
                    utils.removeClass(customStickerStatusCheck, 'hideClass');
                    utils.addClass(customStickerUploadScreen, 'hideClass');
                    utils.addClass(customStickerSent, 'hideClass');
                    utils.addClass(customStickerFtueWrapper, 'hideClass');
                }
            });
        }

    };

    // Reset To Default Sticker Image If Some Error Occurs While Selecting the Image :: Or uploading It
    CustomStickerController.prototype.setDefaultCustomStickerImage = function() {

        console.log('Setting the default custom sticker image');
        customStickerImage.style.backgroundImage = 'none';

    };

    // Show Error State
    CustomStickerController.prototype.showErrorState = function(text) {
        var errorMessage = document.getElementsByClassName('errorMessage')[0];

        errorMessage.innerHTML = text;
        utils.removeClass(errorMessage, 'hideClass');
    };

    // Check Full Form Before Sending Custom Sticker Data
    CustomStickerController.prototype.customStickerFormCheck = function() {

        console.log(customStickerTextPhrase.value);
        console.log(textLanguage.value);
        console.log(customImageUploaded);

        var sendForm = true;

        if (!customImageUploaded || !customStickerTextPhrase || !textLanguage.value) {
            this.showErrorState('Please fill all the details');
            sendForm = false;
        }

        return sendForm;

    };

    CustomStickerController.prototype.chooseStickerImageFromGallery = function() {

        console.log("Need to Test on the Phone");

        var that = this;

        try {
            platformSdk.nativeReq({
                ctx: self,
                fn: 'chooseFile',
                success: function(fileUrl) {

                    fileUrl = decodeURIComponent(fileUrl);
                    fileUrl = JSON.parse(fileUrl);

                    if (!fileUrl.filesize || fileUrl.filesize === 0) {

                        utils.showToast('Bummer. Your image could not be uploaded. Could you try again, please?');

                        //Hide loader
                        //profilePicLoader.classList.remove('picLoader');

                        customImageUploaded = false;
                        that.setDefaultCustomStickerImage();

                        return;

                    }

                    // Check Max Upload Size :: To Be Decided
                    if (fileUrl.filesize > 10000000) {

                        utils.showToast('Max file upload size is 10 Mb');
                        customImageUploaded = false;
                        that.setDefaultCustomStickerImage();

                        // Return To Default Image Here

                        return;
                    }

                    // If Gallery Fetch Of Data Is Possiblle

                    uploadCustomStickerData.filePath = fileUrl.filePath;
                    uploadCustomStickerData.uploadUrl = serverPath;
                    uploadCustomStickerData.doCompress = true;

                    // Show Profile Picture In the Round Tab
                    customStickerImage.style.backgroundImage = 'url(\'file://' + fileUrl.filePath + '\')';
                    customImageUploaded = true;

                }
            });

        } catch (err) {

            platformSdk.ui.showToast('Bummer. Your profile pic couldn’t be updated. Could you try again, please?');

            that.setDefaultCustomStickerImage();

            //Hide loader
            //profilePicLoader.classList.remove('picLoader');

            customImageUploaded = false;
        }
    };


    // Send Custom sticker Data To Server
    CustomStickerController.prototype.sendCustomStickerDataToServer = function() {

        var that = this;
        var formSend = that.customStickerFormCheck();

        if (formSend) {
            console.log('Uploading Image is in Progress');
            utils.removeClass(errorMessage, 'hideClass');

            // SHOW LOADER
            //profilePicLoader.classList.add('picLoader');

            try {
                platformSdk.nativeReq({
                    ctx: self,
                    fn: 'uploadFile',
                    data: platformSdk.utils.validateStringifyJson(uploadCustomStickerData),
                    success: function(res) {
                        console.log(res);
                        try {
                            res = JSON.parse(decodeURIComponent(res));

                            if (res.stat == 'success') {
                                //utils.showToast('Your Image has been updated.');
                                customStickerImage.style.backgroundImage = 'url(\'file://' + fileUrl.filePath + '\')';
                                // Show Sent Screen Here As below
                                utils.removeClass(customStickerSent, 'hideClass');
                            } else {
                                utils.showToast('Bummer. Your image couldn’t be updated. Could you try again, please?');
                                that.setDefaultCustomStickerImage();
                            }
                        } catch (err) {
                            utils.showToast('Bummer. Your image couldn’t be updated. Could you try again, please?');
                            that.setDefaultCustomStickerImage();
                        }

                        //Hide loader
                        //profilePicLoader.classList.remove('picLoader');
                    }
                });

            } catch (err) {
                utils.showToast('Bummer. Your image couldn’t be updated. Could you try again, please?');

                //profilePicLoader.classList.remove('picLoader');
                that.setDefaultCustomStickerImage();
            }
        }
    };

    CustomStickerController.prototype.defineCustomStickerHistory = function(stickers) {

        // All Custom Sticker History
        var allCustomStickers = document.getElementsByClassName('customStickerIcon');

        console.log(stickers);

        for (var i = 0; i < stickers.length; i++) {
            if (stickers[i].url) {
                allCustomStickers[i].style.backgroundImage = 'url(\'' + stickers[i].url + '\')';
            } else {
                console.log('Sticker Icon is not present, please try a default icon');
            }
            if (stickers[i].ts) {
                var timestamp = new Date(stickers[i].ts);
                stickers[i].ts = timestamp.getDate() + '/' + timestamp.getMonth() + '/' + timestamp.getYear();
            } else {
                sticker[i].ts = 'Order date is unavailable';
            }

        }

    };

    CustomStickerController.prototype.convertTimeStamp = function(stickers) {

        for (var i = 0; i < stickers.length; i++) {
            if (stickers[i].ts) {
                var timestamp = new Date(stickers[i].ts);
                stickers[i].ts = timestamp.getDate() + '/' + timestamp.getMonth() + '/' + timestamp.getYear();
            } else {
                sticker[i].ts = 'Order date is unavailable';
            }
        }
    };

    CustomStickerController.prototype.render = function(ctr, App, data) {

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

    CustomStickerController.prototype.destroy = function() {

    };

    module.exports = CustomStickerController;

})(window, platformSdk, platformSdk.events);
