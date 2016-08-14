/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require( '../../libs/js/platformSdk_v2.0' ),
        utils = require( '../util/utils' ),
        cacheProvider = require( '../util/cacheProvider' ),

        RewardsModel = function() {},

        EMPTY_OBJ_READ_ONLY = {};

    RewardsModel.prototype = {

        // Get Reward Router Associated To Type Of Reward
        getRewardRouter : function(rewardType){
            if ( rewardType == 'sticker_reward' ) {
                    return '/stickerReward';
                } else if ( rewardType == 'exclusive_feature' ) {
                    return '/exclusiveFeature';
                } else if ( rewardType == 'user_generated_content' ) {
                    return '/ugc';
                } else if ( rewardType == 'custom_sticker' ) {
                    return '/customSticker';
                }
        },

        showRewardStateToast : function(state){
            if(state == 'unlocked'){
                console.log("The state is currently unlocked :: Can open the reward");
            }else if (state == 'locked'){
                utils.showToast('The reward is currently under locked state. Try again once you unlock it at a higher streak');
            }else if (state == 'redeemed'){
                console.log("Reward already redeemed once or more.");
            }else if (state == 'disabled'){
                utils.showToast('The reward is in disabled state, sorry for the inconvienience');
            }
        },

        // Update the ninja Click Events For rewards
        updateNinjaRewardsLinks: function(App){
            
            var that = this;

            var allRewards = document.getElementsByClassName( 'rewardRow' );

            if ( allRewards.length ) {
                console.log( allRewards );
                for ( var i = 0; i < allRewards.length; i++ ) {
                    allRewards[i].addEventListener( 'click', function( event ) {
                        
                        // Get Reward related information
                        var rewardState = this.getAttribute('data-state');

                        if(rewardState == 'locked'){
                            that.showRewardStateToast(rewardState);
                            return;
                        } else if (rewardState == 'disabled'){
                            that.schowRewardStateToast(rewardState);
                            return;
                        }
                        
                        var rewardType = this.getAttribute( 'data-rewardtype' );
                        var rewardRouter = that.getRewardRouter( rewardType );
                        var rewardId = this.getAttribute('data-rewardId');

                        var data = {};
                        data.rewardId = rewardId;

                        // STUB TO REMOVE 

                        var res1 = {'data':{'customStickers':[],'rewardId':rewardId,'eligible':true}};
                        var res2 = {'data':{'rewardId':rewardId,'customStickers':[{"id":123,"ts":1470916209163,"status":"inProgress","phrase":"Not a blocker", "url":"http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png"}],'eligible':false}};
                        var res3 = {'data':{'rewardId':rewardId,'customStickers':[{"id":123,"ts":1470916209781,"status":"inProgress","phrase":"Not a blocker", "url":"http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png"},{"id":124,"ts":1470916209224,"status":"completed","phrase":"It is a blocker", "url":"http://ih1.redbubble.net/image.79406311.0384/sticker,375x360.u1.png"}],'eligible':true}};
                        
                        App.router.navigateTo( rewardRouter, res3.data);

                        // STUB TO REMOVE

                        // Reward Details API :: Send Reward Id As well
                        App.NinjaService.getRewardDetails(data, function(res) {
                            console.log(res.data);
                            // Routing to the specific Router
                            App.router.navigateTo( rewardRouter, res.data);                            
                        }, this);

                    });
                }
            }
        },

        // Update Ninja Rewards HTML
        updateNinjaRewards: function( rewardsData, App ) {

            console.log( 'Updating the Ninja Rewards Old By New Ninja Rewards' );
            console.log( rewardsData );

            // update helper data with new rewards
            cacheProvider.setInCritical( 'ninjaRewards', rewardsData );

            var ninjaRewardsListOld = document.getElementsByClassName( 'rewardsContainer' )[0]; // Gives Existing List of Rewards in the Template
            ninjaRewardsListOld.innerHTML = '';

            // Re Render The Reward Template Only From External HTML
            this.template = require( 'raw!../../templates/newRewardTemplate.html' );
            ninjaRewardsListOld.innerHTML = Mustache.render( this.template, {
                ninjaRewardsCollection: rewardsData
            });

            this.updateNinjaRewardsLinks( App );

        }

    };

    module.exports = new RewardsModel();
})();
