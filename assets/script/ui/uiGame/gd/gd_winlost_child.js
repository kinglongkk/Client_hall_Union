/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
        
    },

	// use this for initialization
	OnLoad: function () {

	},
    ShowSpecData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];

        //阵营
        let lb_zhenying = this.node.getChildByName("contentLayout").getChildByName("lb_zhenying");
        lb_zhenying.active = true;
        let zhenying = lb_zhenying.getComponent(cc.Label);
        let jiPaiSteps = -1; 
        if (player.isRed) {
            zhenying.string = "红方";
            jiPaiSteps = player["redSteps"];
        }else{
            zhenying.string = "蓝方";
            jiPaiSteps = player["blueSteps"];
        }
        
        //底分
        let lb_jipai = this.node.getChildByName("contentLayout").getChildByName("lb_jipai");
        lb_jipai.active = true;
        let jipai = lb_jipai.getComponent(cc.Label);
        jipai.string = jiPaiSteps;
    },
});
