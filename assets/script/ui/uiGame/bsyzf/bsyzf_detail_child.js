/*

 */

let app = require("app");

cc.Class({
    extends: require("BasePoker_detail_child"),

    properties: {},

    // use this for initialization
    OnLoad: function () {

    },
    ShowPlayerData: function (resultsList, playerAll, idx) {
        let data = resultsList[idx];
        let userInfo = this.node.getChildByName("user_info");
        if (userInfo) {
            userInfo.getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
            userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
            for (let index in playerAll) {
                let player = playerAll[index];
                if (player.pid == data.pid) {
                    userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
                    break;
                }
            }
        }
        this.node.getChildByName("lb_win").getComponent(cc.Label).string = "";
        this.node.getChildByName("lb_lose").getComponent(cc.Label).string = "";
        if (data.point >= 0) {
            this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + data.point;
            this.node.getChildByName("lb_win_num").active = true;
            this.node.getChildByName("lb_lose_num").active = false;
        } else {
            this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = data.point;
            this.node.getChildByName("lb_win_num").active = false;
            this.node.getChildByName("lb_lose_num").active = true;
        }
        //比赛分
        if (typeof(data.sportsPoint) != "undefined") {
            this.node.getChildByName("lb_sportsPoint").active = true;
            if (data.sportsPoint > 0) {
                this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + data.sportsPoint;
            } else {
                this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = data.sportsPoint;
            }
        } else {
            this.node.getChildByName("lb_sportsPoint").active = false;
        }
        if (this.node.getChildByName('icon_dissolve') != null) {
            //显示是否解散（-1:正常结束,0:未操作,1:同意操作,2:拒绝操作,3:发起者）
            if (typeof(data.dissolveState) == "undefined" || data.dissolveState == -1) {
                this.node.getChildByName('icon_dissolve').active = false;
            } else {
                let imagePath = "texture/record/img_dissolve" + data.dissolveState;
                let that = this;
                //加载图片精灵
                cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
                    if (error) {
                        console.log("加载图片精灵失败  " + imagePath);
                        return
                    }
                    that.node.getChildByName('icon_dissolve').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    that.node.getChildByName('icon_dissolve').active = true;
                });
            }
        }

    },
});
