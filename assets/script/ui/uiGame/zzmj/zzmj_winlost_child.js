/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		huaNum:cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	UpdatePlayData:function(PlayerNode,HuList,PlayerInfo,jin1=0,jin2=0,maPaiLst = null){
		this.showLabelNum=1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示竞技点
		if (typeof(HuList.sportsPoint)!="undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分：+"+HuList.sportsPoint);
			}else{
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分："+HuList.sportsPoint);
			}
		}
		this.huaNum.active = false;
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'),HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'),HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'),PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'),HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'),HuList.shouCard,HuList.handCard,jin1,jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'),HuList.huaList);
	},
	LabelName:function(huType){
        let LabelArray=[];
        LabelArray["LianZhuang"]="连庄";
        LabelArray["DiFen"]="底分";
        LabelArray["PingHu"]="点炮胡";
        LabelArray["Hu"]="自摸";
        LabelArray["WuJinZiMo"]="无金自摸";
        LabelArray["SanJinDao"]="三金倒";
        LabelArray["LiuJinDao"]="六金倒";
        LabelArray["TianHu"]="天胡";
        LabelArray["DanYou"]="单游";
        LabelArray["ShuangYou"]="双游";
        LabelArray["SanYou"]="三游";
        LabelArray["QiangJin"]="抢金";
        LabelArray["JieGang"]="接杠";
        LabelArray["AnGang"]="暗杠";
        LabelArray["Gang"]="补杠";
        LabelArray["HuaGang"]="花杠";
        LabelArray["FenBing"]="分饼分";
        return LabelArray[huType];
    },
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = false;
		if (huInfoAll['endPoint']) {
			huInfo = huInfoAll['endPoint'];
		} else {
			huInfo = huInfoAll;
		}
		let lianZhuang = ShowNode.getChildByName('lianzhuang').getComponent(cc.Label);
		let zhuang = ShowNode.getChildByName('zhuang').getComponent(cc.Label);
		let difen = ShowNode.getChildByName('difen').getComponent(cc.Label);
		lianZhuang.string = "";
		zhuang.string = "";
		difen.string = "";
		ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "";
		let huTypeMap = huInfo["huTypeMap"];
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			if(huType == "DiFen"){
				 difen.string = this.LabelName(huType) + huPoint;
			}else if(huType == "LianZhuang"){
				 lianZhuang.string = this.LabelName(huType) + huPoint;
			}else if(huType == "PiaoFen"){
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), "插" + huPoint + "盘");
			}else{
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "番");
			}
		}
	},
	ShowPlayerHuaCard: function (huacardscrollView, hualist) {
		huacardscrollView.active = true;
		if (hualist.length > 0) {
			this.huaNum.active = true;
			this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		} else {
			this.huaNum.active = false;
			this.huaNum.getComponent(cc.Label).string = "";
		}
		let view = huacardscrollView.getChildByName("view");
		let ShowNode = view.getChildByName("huacard");
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);

	},
});
