(function(W, events) {
    'use strict';

    var WorkspaceController = require('./controllers/workspace'),
        ExclusiveFeatureController = require('./controllers/ExclusiveFeatureController'),
        StickerRewardController = require('./controllers/StickerRewardController'),
        CustomerStickerController = require('./controllers/CustomerStickerController'),
        CrowdSourcingController = require('./controllers/CrowdSourcingController'),
        FaqDetailsController = require('./controllers/FaqDetailsController'),
        StickerPackViewController = require('./controllers/StickerPackViewController'),
        CoolDownController = require('./controllers/CoolDownController'),
        StateController = require('./controllers/StateController'),


        Router = require('./util/router'),
        utils = require('./util/utils'),
        profileModel = require('./models/profileModel'),
        rewardsModel = require('./models/rewardsModel'),
        activityModel = require('./models/activityModel'),
        mysteryBoxModel = require('./models/mysteryBoxModel'),
        cacheProvider = require('./util/cacheProvider'),
        expHandlerAB = require('./util/expHandlerAB'),
        TxService = require('./util/txServices'),
        NinjaService = require('./util/ninjaServices');

    // Full Screen Loader
    var loader = document.getElementById('loader');
    var loadObject = events.subscribe('update.loader', function(params) {
        loader.toggleClass('loading', params.show);
    });

    // Tap State Events :: Touch Start And Touch End

    document.addEventListener('touchstart', function(evt) {
        evt = evt || window.event;
        var target = evt.target;
        if (target.classList.contains('buttonTapWhite')) {
            target.classList.add('tapStateWhite');
        } else if (target.classList.contains('buttonTapRed')) {
            target.classList.add('tapStateRed');
        } else if (target.classList.contains('buttonTapOffer')) {
            target.classList.add('tapStateOffer');
        } else {
            return;
        }
    }, false);

    document.addEventListener('touchend', function(evt) {
        evt = evt || window.event;
        var target = evt.target;
        if (target.classList.contains('buttonTapWhite')) {
            target.classList.remove('tapStateWhite');
        } else if (target.classList.contains('buttonTapRed')) {
            target.classList.remove('tapStateRed');
        } else if (target.classList.contains('buttonTapOffer')) {
            target.classList.remove('tapStateOffer');
        } else {
            return;
        }
    }, false);

    // Block Connection Tab
    var isBlock = document.getElementById('blockScreen');
    var isBlockObject = events.subscribe('app/block', function(params) {
        isBlock.toggleClass('block-msg', params.show);
    });

    var unBlockApp = function() {
        var self = this;
        var id = '' + platformSdk.retrieveId('app.menu.om.block');

        platformSdk.appData.block = 'false';
        if (platformSdk.bridgeEnabled) platformSdk.unblockChatThread();
        platformSdk.events.publish('app.state.block.hide');
        platformSdk.updateOverflowMenu(id, {
            'title': 'Block'
        });

        //utils.toggleBackNavigation( false );
        events.publish('update.loader', {
            show: false
        });
        events.publish('app/block', {
            show: false
        });
    };

    var Application = function(options) {
        this.container = options.container;
        this.routeIntent = options.route;

        // Router Controller
        this.router = new Router();
        // Profile Controller
        this.workspaceController = new WorkspaceController();

        //Rewards Controller
        this.exclusiveFeatureController = new ExclusiveFeatureController();
        this.stickerRewardController = new StickerRewardController();
        this.customerStickerController = new CustomerStickerController();
        this.crowdSourcingController = new CrowdSourcingController();
        this.faqDetailsController = new FaqDetailsController();
        this.stickerPackViewController = new StickerPackViewController();
        this.coolDownController = new CoolDownController();
        this.stateController = new StateController();



        // Communication Controller
        this.TxService = new TxService();
        this.NinjaService = new NinjaService(this.TxService); //communication layer
    };

    Application.prototype = {

        // Three Dot Menu Overflow Events Subscriptions
        OverflowEvents: function() {

            var that = this;

            // Notifications ON/OFF
            platformSdk.events.subscribe('app.menu.om.mute', function(id) {
                id = '' + platformSdk.retrieveId('app.menu.om.mute');

                if (platformSdk.appData.mute == 'true') {
                    platformSdk.appData.mute = 'false';
                    platformSdk.muteChatThread();
                    platformSdk.updateOverflowMenu(id, {
                        'is_checked': 'true'
                    });
                } else {
                    platformSdk.appData.mute = 'true';
                    platformSdk.muteChatThread();
                    platformSdk.updateOverflowMenu(id, {
                        'is_checked': 'false'
                    });
                }
            });

            // Block Event From The Three Dot
            platformSdk.events.subscribe('app.menu.om.block', function(id) {
                id = '' + platformSdk.retrieveId('app.menu.om.block');
                if (platformSdk.appData.block === 'true') {
                    unBlockApp();

                } else {
                    platformSdk.appData.block = 'true';
                    platformSdk.blockChatThread();
                    platformSdk.events.publish('app.state.block.show');
                    platformSdk.updateOverflowMenu(id, {
                        'title': 'Unblock'
                    });
                    utils.toggleBackNavigation(false);
                    events.publish('app/block', {
                        show: true
                    });
                    events.publish('app/offline', {
                        show: false
                    });

                }
            });
        },

        // Setting Up The Three Dot Menu
        initOverflowMenu: function() {

            var that = this;

            var omList = [{
                    'title': 'Notifications',
                    'en': 'true',
                    'eventName': 'app.menu.om.mute',
                    'is_checked': platformSdk.appData.mute === 'true' ? 'false' : 'true'
                },

                {
                    'title': platformSdk.appData.block === 'true' ? 'Unblock' : 'Block',
                    'en': 'true',
                    'eventName': 'app.menu.om.block'
                }
            ];

            that.OverflowEvents();

            platformSdk.setOverflowMenu(omList);
        },

        // If card Data Comes From Any Forwarded Card that calls Open Non Messaging Bot Here
        getIntentData: function(data) {
            var that = this;
            //console.log(data);
            data = decodeURIComponent(data);
            data = JSON.parse(data);

        },

        backPressTrigger: function() {

            var stickerCooldownElement = document.getElementsByClassName('stickerCooldownContainer')[0];
            var stickerShopElement = document.getElementsByClassName('stickerShopPageOne')[0];
            var customStickerHistory = document.getElementsByClassName('customStickerHistory')[0];
            var showHistoryButton = document.getElementsByClassName('showHistoryButton')[0];
            var customStickerReadyState = document.getElementsByClassName('customStickerReadyState')[0];
            var customStickerStatusCheck = document.getElementsByClassName('customStickerStatusCheck')[0];
            var customStickerUploadScreen = document.getElementsByClassName('customStickerUploadScreen')[0];
            var uploadParent = document.getElementsByClassName('uploadParent')[0];

            if (stickerCooldownElement || stickerShopElement) {
                this.goToNinjaProfilePage();
                return;
            } else if (customStickerHistory && !customStickerHistory.classList.contains('hideClass')) {
                customStickerHistory.classList.add('hideClass');
                showHistoryButton.classList.remove('hideClass');
                if (customStickerUploadScreen && customStickerUploadScreen.classList.contains('hideClass')) {
                    customStickerUploadScreen.classList.remove('hideClass');
                }
                if (uploadParent && uploadParent.classList.contains('hideClass')) {
                    uploadParent.classList.remove('hideClass');
                }
                return;
            } else if (customStickerReadyState && !customStickerReadyState.classList.contains('hideClass')) {
                customStickerReadyState.classList.add('hideClass');
                customStickerHistory.classList.remove('hideClass');
                return;
            } else if (customStickerStatusCheck && !customStickerStatusCheck.classList.contains('hideClass')) {
                customStickerStatusCheck.classList.add('hideClass');
                customStickerHistory.classList.remove('hideClass');
                if (customStickerUploadScreen) {
                    customStickerUploadScreen.classList.remove('hideClass');
                }
                return;
            }

            this.router.back();
        },

        goToNinjaProfilePage: function() {
            var that = this;
            var data = {};

            data.ninjaRewardsCollection = cacheProvider.getFromCritical('ninjaRewards');
            data.ninjaProfileData = cacheProvider.getFromCritical('ninjaProfileData');
            data.ninjaActivityData = cacheProvider.getFromCritical('ninjaStats');

            that.router.navigateTo('/', data);
        },

        getRoute: function() {
            var that = this;

            // ToDo: Remvove this if block from here?
            if (this.routeIntent !== undefined) {

            } else {
                events.publish('app.store.get', {
                    key: '_routerCache',
                    ctx: this,
                    cb: function(r) {
                        if (r.status === 1 && platformSdk.bridgeEnabled) {
                            try {
                                that.router.navigateTo(r.results.route, r.results.cache);
                            } catch (e) {
                                that.router.navigateTo('/');
                            }
                        } else {
                            that.router.navigateTo('/');
                        }
                    }
                });
            }
        },

        start: function() {

            var self = this;
            self.$el = $(this.container);

            self.initOverflowMenu();

            expHandlerAB.getVal(cacheProvider.getFromCritical('lockedRewardAB_key'), JSON.parse(cacheProvider.getFromCritical('lockedRewardAB_defaultVal')), function(response) {
                cacheProvider.setInCritical('lockedGreyout', JSON.parse(response));
            })

            utils.toggleBackNavigation(false);
            document.querySelector('.unblockButton').addEventListener('click', function() {
                unBlockApp();
            }, false);

            // No Internet Connection Tab
            var noInternet = document.getElementById('nointernet');
            var noInternetObject = events.subscribe('app/offline', function(params) {
                noInternet.toggleClass('no-internet-msg', params.show);

            });

            platformSdk.events.subscribe('onBackPressed', function() {
                self.backPressTrigger();
            });

            platformSdk.events.subscribe('onUpPressed', function() {
                self.backPressTrigger();
            });

            // Ninja Home Screen Router :: Three Tabs (Rewards/Activity/Mystery Box)
            this.router.route('/', function(data) {
                self.container.innerHTML = '';
                self.workspaceController.render(self.container, self, data);
                utils.toggleBackNavigation(false);
            });

            // Exclusive Features :: Friend Emojis + GIF Sharing 
            this.router.route('/exclusiveFeature', function(data) {
                self.container.innerHTML = '';
                self.exclusiveFeatureController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            // Sticker Features :: Early Access + Exclusive Stickers + Animated Sticker Incorporate Here 
            this.router.route('/stickerReward', function(data) {
                self.container.innerHTML = '';
                self.stickerRewardController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            this.router.route('/stickerPackView', function(data) {
                self.container.innerHTML = '';
                self.stickerPackViewController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });



            // Custom Sticker Controller 
            this.router.route('/customSticker', function(data) {
                self.container.innerHTML = '';
                self.customerStickerController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            // Crowd Sourcing Reward Controller
            this.router.route('/ugc', function(data) {
                self.container.innerHTML = '';
                self.crowdSourcingController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            // FAQ All Rewards Controller 
            this.router.route('/rewardFaq', function(data) {
                self.container.innerHTML = '';
                self.faqDetailsController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            // FAQ All Rewards Controller 
            this.router.route('/coolDown', function(data) {
                self.container.innerHTML = '';
                self.coolDownController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });


            // FAQ All Rewards Controller 
            this.router.route('/userState', function(data) {
                self.container.innerHTML = '';
                self.stateController.render(self.container, self, data);
                utils.toggleBackNavigation(false);
            });

            // STUB TO REMOVE
            // Profile Call Fetches this res and sends to the profile udpater

            // self.router.navigateTo('/');

            // var res = { 'data': { "battery": 6, "rewards_hash": "be96dc8c0a876b08c8076b03acdee0db5", "status": "active", "streak": 1, "name": 'Hemank Sabharwal' } };
            // profileModel.updateNinjaData(res.data, self);
            // activityModel.fetchNinjaActivity('lifetime');
            // mysteryBoxModel.getMysteryBoxDetails(self);

            // STUB TO REMOVE


            /* STUB for user state */

            /*var stateData = {
                'url': 'https://s16.postimg.org/re8de8j11/Bitmap.png',
                'title': 'Ninja Life',
                'subtitle': 'Oops! You lose all the ninja life…but don’t worry just use hike for few more days to get your life back',
                'per': '20',
                'cta': {
                    'text': 'Learn More',
                    'link': 'https://s16.postimg.org/re8de8j11/Bitmap.png',
                    'title': 'Learn More'
                }
            }*/

            /****************************/

            var ftueCompleted = cacheProvider.getFromCritical('ftueCompleted');
            //var ftueCompleted = true;
            if (ftueCompleted) {
                console.log("This is and old user :: Fetching Profile battery and streak for the user");

                // Check If Block True Or False
                if (platformSdk.appData.block === 'true') {

                    console.log('User has blocked the Application');
                    events.publish('app/block', {
                        show: true
                    });
                }

                this.NinjaService.getNinjaProfile(function(res) {
                    console.log(res.data);
                    if (res.data.status == 'inactive' || res.data.status == 'locked') {

                        self.router.navigateTo('/userState', res.data);
                        console.log("User state  is " + res.data.status);

                    } else {

                        // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
                        self.router.navigateTo('/');
                        profileModel.updateNinjaData(res.data, self);
                        activityModel.fetchNinjaActivity('lifetime');
                        //mysteryBoxModel.getMysteryBoxDetails(self);
                    }
                }, this);
            }
            // Show FTUE To the User
            else {
                // STUB TO REMOVE

                var data = {};

                this.ninjaRewardsData = { 'rewards': [], 'rewards_hash': '' };
                this.ninjaProfileData = { "battery": 0, "rewards_hash": "", "status": "active", "streak": 0, "name": '' };
                this.ninjaActivityData = { "chatThemes": { "rec": 0, "sent": 0 }, "files": { "rec": 0, "sent": 0 }, "messages": { "rec": 0, "sent": 0 }, "statusUpdates": { "count": 0 }, "stickers": { "rec": 0, "sent": 0 } };

                // STUB TO REMOVE

                data.ninjaRewardsCollection = this.ninjaRewardsData;
                data.ninjaProfileData = this.ninjaProfileData;
                data.ninjaActivityData = this.ninjaActivityData;

                this.NinjaService.getNinjaProfile(function(res) {
                    console.log(res.data);
                    cacheProvider.setInCritical('ftueCompleted', true);


                    if (res.data.status == 'inactive' || res.data.status == 'locked') {

                        self.router.navigateTo('/userState', res.data);
                        console.log("User state  is " + res.data.status);

                    } else {
                        // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
                        self.router.navigateTo('/', data);
                        profileModel.updateNinjaData(res.data, self);
                        activityModel.fetchNinjaActivity('lifetime');
                        //mysteryBoxModel.getMysteryBoxDetails(self);
                    }
                }, this);
            }

        }
    };

    module.exports = Application;

})(window, platformSdk.events);