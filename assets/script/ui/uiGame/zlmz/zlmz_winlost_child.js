/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
        icon_fct:cc.SpriteFrame,
        icon_ct:cc.SpriteFrame,
    },

	// use this for initialization
	OnLoad: function () {

	},
    ShowPlayerData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];

        let point  = player.point;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        if(point > 0){
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
        }
        else{
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
        }

        //比赛分
        let lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if(player.sportsPoint > 0){
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            }
            else{
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
        }else{
            lb_sportsPointTitle.active = false;
        }

        
        //炸弹分
        this.node.getChildByName("lb_bombFen").active = true;
        this.node.getChildByName("lb_bombFen").getComponent(cc.Label).string = this.ToUiScore(player.zhaDanFen);

        //牌张分
        this.node.getChildByName("lb_paiFen").active = true;
        this.node.getChildByName("lb_paiFen").getComponent(cc.Label).string = this.ToUiScore(player.paiZhangFen);
        
        //憋2
        this.node.getChildByName("lb_bie2Fen").active = true;
        this.node.getChildByName("lb_bie2Fen").getComponent(cc.Label).string = this.ToUiScore(player.bie2Fen);


        // //显示春天或者反春天
        let icon_robClose = this.node.getChildByName("icon_robClose");
        icon_robClose.active = player.existChunTian;
        
        // if (player.robClose == -1) {
        //     icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_fct;
        // }else if (player.robClose == 1) {
        //     icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_ct;    
        // }else{
        //     icon_robClose.active = false;
        // }


        let playerInfo = null;
        for(let i = 0;i < playerAll.length;i++){
            if(player.pid == playerAll[i].pid){
                playerInfo = playerAll[i];
                break;
            }
        }
        
        let head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        head.ShowHeroHead(playerInfo.pid);
        //玩家名字
        let playerName = "";
        playerName = playerInfo.name;
        if(playerName.length > 6){
            playerName = playerName.substring(0, 6) + '...';
        }
        let name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        let id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
    },
    ToUiScore: function (score) {
        if (0 === score) return 0;
        if (!score) return "";

        let symbol = score > 0 ? "+" : "";
        return symbol + score;
    },
});
