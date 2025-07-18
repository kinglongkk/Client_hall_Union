/*

 */

let app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
    },

    // use this for initialization
    OnLoad: function () {

    },
    ShowPlayerData: function (resultsList, playerAll, idx) {
        let data = resultsList[idx];
        let userInfo = this.node.getChildByName("user_info");
        if (userInfo) {
            userInfo.getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
            userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
            for (let index in playerAll) {
                let player = playerAll[index];
                if (player.pid == data.pid) {
                    userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
                    // if(player.sex==app.ShareDefine().HeroSex_Boy){
                    //     userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame=this.SpriteMale;
                    // }else if(player.sex==app.ShareDefine().HeroSex_Girl){
                    //     userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame=this.SpriteFeMale;
                    // }
                    break;
                }
            }
        }

        let jiesuan = this.node.getChildByName("jiesuan");
        let show = 1;
        let showLabel = false;
        if (jiesuan) {
            this.huTypesShow(jiesuan, data);
            if (data.point >= 0) {
                jiesuan.getChildByName("lb_win").active = true;
                jiesuan.getChildByName("lb_lost").active = false;
                jiesuan.getChildByName("lb_win").getComponent(cc.Label).string = '+' + data.point;
            } else {
                jiesuan.getChildByName("lb_win").active = false;
                jiesuan.getChildByName("lb_lost").active = true;
                jiesuan.getChildByName("lb_lost").getComponent(cc.Label).string = data.point;
            }
            //比赛分
            if (typeof (data.sportsPoint) != "undefined") {
                jiesuan.getChildByName("lb_sportsPoint").active = true;
                if (data.sportsPoint > 0) {
                    jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "比赛分：+" + data.sportsPoint;
                } else {
                    jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "比赛分：" + data.sportsPoint;
                }
            } else {
                jiesuan.getChildByName("lb_sportsPoint").active = false;
            }
        }
        let maxPoint = 0;
        let maxDianPao = 0;
        for (let i = 0; i < resultsList.length; i++) {
            let data = resultsList[i];
            if (data.point > maxPoint) {
                maxPoint = data.point;
            }
            if (data.dianPaoPoint > maxDianPao) {
                maxDianPao = data.dianPaoPoint;
            }
        }
        //显示大赢家图标
        if (data.dianPaoPoint >= maxDianPao && maxDianPao > 0) {
            this.node.getChildByName('icon_paoshou').active = true;
        } else {
            this.node.getChildByName('icon_paoshou').active = false;
        }
        if (data.point >= maxPoint) {
            this.node.getChildByName('icon_win').active = true;
            this.node.getChildByName('icon_paoshou').active = false;
        } else {
            this.node.getChildByName('icon_win').active = false;
        }

        if (this.node.getChildByName('icon_dissolve') != null) {
            //显示是否解散（-1:正常结束,0:未操作,1:同意操作,2:拒绝操作,3:发起者）
            if (typeof (data.dissolveState) == "undefined" || data.dissolveState == -1) {
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

    huTypesShow: function (jiesuan, huData) {
		let jiepao = this.GetJiePaoCount(huData);
		let hupaiNum = huData.huTypes.length - jiepao;
        jiesuan.getChildByName('top').getChildByName('hupai').getComponent(cc.Label).string = hupaiNum;
        jiesuan.getChildByName('top').getChildByName('jiepao').getComponent(cc.Label).string = jiepao;
        jiesuan.getChildByName('top').getChildByName('dianpao').getComponent(cc.Label).string = huData.dianPaoPoint;
        // jiesuan.getChildByName('top').getChildByName('lb_sanyou').getComponent(cc.Label).string = huData.sanYouPoint;
        // jiesuan.getChildByName('top').getChildByName('lb_kaigang').getComponent(cc.Label).string = huData.kaiGangPoint;
    },

	GetJiePaoCount: function (huData) {
		let jiepao = 0;
		for (let i = 0; i < huData.huTypes.length; i++) {
			if (huData.huTypes[i] == 'JiePao') {
				jiepao++;
			}
		}
		return jiepao;
	},
});
