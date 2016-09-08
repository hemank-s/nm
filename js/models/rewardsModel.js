/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),
        utils = require('../util/utils'),
        cacheProvider = require('../util/cacheProvider'), 
        Constants = require('../../constants.js'),

        RewardsModel = function() {},

        EMPTY_OBJ_READ_ONLY = {};

    RewardsModel.prototype = {

        // Get Reward Router Associated To Type Of Reward
        getRewardRouter: function(rewardType) {
            if (rewardType == 'sticker_reward') {
                return '/stickerReward';
            } else if (rewardType == 'exclusive_feature') {
                return '/exclusiveFeature';
            } else if (rewardType == 'user_generated_content') {
                return '/ugc';
            } else if (rewardType == 'custom_sticker') {
                return '/customSticker';
            }
        },

        showRewardStateToast: function(state) {
            if (state == Constants.REWARD_STATE.UNLOCKED) {
                console.log("The state is currently unlocked :: Can open the reward");
            } else if (state == Constants.REWARD_STATE.LOCKED) {
                utils.showToast('The reward is currently under locked state. Try again once you unlock it at a higher streak');
            } else if (state == Constants.REWARD_STATE.REDEEMED) {
                console.log("Reward already redeemed once or more.");
            } else if (state == Constants.REWARD_STATE.DISABLED) {
                utils.showToast('The reward is in disabled state, sorry for the inconvienience');
            }
        },

        updateNinjaRewardsIcons: function(data){
            var that = this;

            var allRewards = document.getElementsByClassName('rewardRow');

            if (allRewards.length) {
                console.log(allRewards);
                for (var i = 0; i < allRewards.length; i++) {
                    var icon = allRewards[i].getElementsByClassName('rewardIcon')[0];
                    icon.style.backgroundImage = 'url(\'' + data[i].icon + '\')';
                }
            }
        },

        // Update the ninja Click Events For rewards
        updateNinjaRewardsLinks: function(App) {

            var that = this;

            var allRewards = document.getElementsByClassName('rewardRow');

            if (allRewards.length) {
                console.log(allRewards);
                for (var i = 0; i < allRewards.length; i++) {
                    allRewards[i].addEventListener('click', function(event) {

                        // Get Reward related information
                        var rewardState = this.getAttribute('data-state');

                        if (rewardState == Constants.REWARD_STATE.LOCKED) {
                            that.showRewardStateToast(rewardState);
                            return;
                        } else if (rewardState == Constants.REWARD_STATE.DISABLED) {
                            that.showRewardStateToast(rewardState);
                            return;
                        }

                        var rewardType = this.getAttribute('data-rewardtype');
                        var rewardRouter = that.getRewardRouter(rewardType);
                        var rewardId = this.getAttribute('data-rewardId');

                        var data = {};
                        data.rewardId = rewardId;

                        // STUB TO REMOVE 

                        // var res1 = {'data':{'customStickers':[],'rewardId':rewardId,'eligible':true}};
                        // var res2 = {'data':{'rewardId':rewardId,'customStickers':[{"id":123,"ts":1470916209163,"status":"inProgress","phrase":"Not a blocker", "url":"http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png"}],'eligible':false}};
                        // var res3 = {'data':{'rewardId':rewardId,'customStickers':[{"id":123,"ts":1470916209781,"status":"inProgress","phrase":"Not a blocker", "url":"http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png"},{"id":124,"ts":1470916209224,"status":"completed","phrase":"It is a blocker", "url":"http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png"}],'eligible':true}};

                        // var stickerRes = {"title":"Early Access Stickers","stitle":"Get the best stickers on hike way before everyone else does. You get these 2 weeks before mere mortals. You're a Ninja!","hicon":"http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png","packs":[{"catId":"bengalibabu","copyright":"Copyright \u00a92016 Hike Limited","desc":"Check out these funny Bong Babu stickers!","name":"Bong Babu","new":1,"nos":30,"size":864090,"status":"notdownloaded","sticker_list":["030_benbabu_humkiptenahihai.png","029_benbabu_matlab.png","028_benbabu_bahutburahua.png","027_benbabu_sobshottihai.png","026_benbabu_kisikobolnamat.png"]},{"catId":"bengalibabu","copyright":"Copyright \u00a92016 Hike Limited","desc":"Check out these funny Bong Babu stickers!","name":"Bong Babu","new":1,"nos":30,"size":864090,"status":"notdownloaded","sticker_list":["030_benbabu_humkiptenahihai.png","029_benbabu_matlab.png","028_benbabu_bahutburahua.png","027_benbabu_sobshottihai.png","026_benbabu_kisikobolnamat.png"]},{"catId":"bengalibabu","copyright":"Copyright \u00a92016 Hike Limited","desc":"Check out these funny Bong Babu stickers!","name":"Bong Babu","new":1,"nos":30,"size":864090,"status":"notdownloaded","sticker_list":["030_benbabu_humkiptenahihai.png","029_benbabu_matlab.png","028_benbabu_bahutburahua.png","027_benbabu_sobshottihai.png","026_benbabu_kisikobolnamat.png"]}]};

                        // STUB TO REMOVE

                        // Reward Details API :: Send Reward Id As well
                        App.NinjaService.getRewardDetails(data, function(res) {
                            console.log(res.data);
                             App.router.navigateTo(rewardRouter,{ "rewardDetails": res.data , "rewardId" :rewardId, "rewardRouter":rewardRouter} );
                        }, this);
                    });
                }
            }
        },

        // Update Ninja Rewards HTML
        updateNinjaRewards: function(rewardsData, App) {

            console.log('Updating the Ninja Rewards Old By New Ninja Rewards');
            console.log(rewardsData);

            // update helper data with new rewards

            cacheProvider.setInCritical('ninjaRewards', rewardsData);
            console.log("helper data is", platformSdk.appData.helperData);

            var ninjaRewardsListOld = document.getElementsByClassName('rewardsContainer')[0]; // Gives Existing List of Rewards in the Template
            ninjaRewardsListOld.innerHTML = '';

            // Re Render The Reward Template Only From External HTML
            this.template = require('raw!../../templates/newRewardTemplate.html');
            ninjaRewardsListOld.innerHTML = Mustache.render(this.template, {
                ninjaRewardsCollection: rewardsData.rewards,
                lockedGreyout : cacheProvider.getFromCritical('lockedGreyout')
            });

            this.updateNinjaRewardsLinks(App);
            this.updateNinjaRewardsIcons(rewardsData.rewards);
        }

    };

    module.exports = new RewardsModel();
})();