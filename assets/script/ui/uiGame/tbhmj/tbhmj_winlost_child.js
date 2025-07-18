/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();
	},
    ShowPlayerHuImg:function(huNode,huTypeName){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType=this.ShareDefine.HuTypeStringDict[huTypeName];
        if(typeof(huType)=="undefined"){
            huNode.getComponent(cc.Label).string = '';
        }else if(huType == this.ShareDefine.HuType_DianPao){
            huNode.getComponent(cc.Label).string = '点泡';
        }else if(huType == this.ShareDefine.HuType_JiePao){
            huNode.getComponent(cc.Label).string = '接炮';
        }else if(huType == this.ShareDefine.HuType_ZiMo){
            huNode.getComponent(cc.Label).string = '自摸';
        }else if(huType == this.ShareDefine.HuType_QGH){
            huNode.getComponent(cc.Label).string = '抢杠胡';
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    LabelName:function(huType){
        let huTypeDict = {};
        huTypeDict["HU"]="平胡";
        huTypeDict["DDHU"]="七对";
        huTypeDict["HYS"]="混一色";
        huTypeDict["PPHU"]="碰碰胡";
        huTypeDict["GSKH"]="杠上开花";
        huTypeDict["QGH"]="抢杠胡";
        huTypeDict["QYS"]="清一色";
        huTypeDict["ZiYiSe"]="字一色";
        huTypeDict["SSBK"]="十三烂";
        huTypeDict["SSBK_Qing"]="七星十三烂";
        huTypeDict["TIANHU"]="天胡";
        huTypeDict["DIHU"]="地胡";
        huTypeDict["ZHENHU"]="真胡";
        huTypeDict["LIANGGANG"]="连杠";
        huTypeDict["GANGPOINT"]="杠分";
        huTypeDict["LGAG"]="暗杠杠开";
        huTypeDict["LGJG"]="接杠杠开";
        huTypeDict["LGMG"]="明杠杠开";

        return huTypeDict[huType];
    },

});
