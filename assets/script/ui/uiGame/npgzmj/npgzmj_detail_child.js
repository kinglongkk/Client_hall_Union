/*

 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_detail_child"),

	properties: {
	},

	// use this for initialization
	OnLoad: function () {

	},

	huTypesShow: function (jiesuan, huData) {
		jiesuan.getChildByName('top').getChildByName('lb_dianGang').getComponent(cc.Label).string = huData.dianGangPoint;
		jiesuan.getChildByName('top').getChildByName('lb_mingGang').getComponent(cc.Label).string = huData.mingGangPoint;
		jiesuan.getChildByName('top').getChildByName('lb_anGang').getComponent(cc.Label).string = huData.anGangPoint;
		jiesuan.getChildByName('top').getChildByName('lb_zhongMa').getComponent(cc.Label).string = huData.zhongMaPoint;

		jiesuan.getChildByName('top').getChildByName('lb_dianpao').getComponent(cc.Label).string = huData.dianPaoPoint;
		jiesuan.getChildByName('top').getChildByName('lb_jiepao').getComponent(cc.Label).string = huData.jiePaoPoint;
		jiesuan.getChildByName('top').getChildByName('lb_zimo').getComponent(cc.Label).string = huData.ziMoPoint;
		jiesuan.getChildByName('top').getChildByName('lb_jieGang').getComponent(cc.Label).string = huData.jieGangPoint;
	},


});
