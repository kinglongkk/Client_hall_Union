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
    ShowPlayerData:function(setEnd,playerAll,index){
        let jin1=setEnd.jin1;
        let jin2=setEnd.jin2;
        let dPos=setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray=new Array();
        let posCount = posResultList.length;
        for(let i=0; i<posCount; i++){
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos]=posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode=this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode,posResultList[index]['huType']);

        if(dPos===index){
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if(PlayerInfo["pid"] && PlayerInfo["iconUrl"]){
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"],PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    LabelName:function(huType){
        let LabelArray=[];
        LabelArray["Gang"]="补杠";
        LabelArray["AnGang"]="暗杠";
        LabelArray["JieGang"]="直杠";
        LabelArray["DianGang"]="点杠";
        LabelArray["DianPeng"]="点碰";
        LabelArray["QianShao"]="前烧";
        LabelArray["HouShao"]="后烧";
        LabelArray["ZhongMa"]="中马";

        LabelArray["SSL"]="十三烂";
        LabelArray["QSSSL"]="七星十三烂";
        LabelArray["PPH"]="碰碰胡";
        LabelArray["PPHQYS"]="碰碰胡清一色";
        LabelArray["PPHZYS"]="碰碰胡字一色";

        LabelArray["QYS"]="清一色真胡";
        LabelArray["QYSSiGuiQD"]="清一色真胡四归一七对";
        LabelArray["QYSBaGuiQD"]="清一色真胡八归一七对";
        LabelArray["QYSShiErGuiQD"]="清一色真胡十二归一七对";
        LabelArray["QYSZhenSiGui"]="清一色真胡四归一";
        LabelArray["QYSZhenBaGui"]="清一色真胡八归一";
        LabelArray["QYSZhenShiErGui"]="清一色真胡十二归一";

        LabelArray["QYSJia"]="清一色假胡";
        LabelArray["QYSJiaSiGui"]="清一色假胡四归一";
        LabelArray["QYSJiaBaGui"]="清一色假胡八归一";
        LabelArray["QYSJiaShiErGui"]="清一色假胡十二归一";

        LabelArray["ZYS"]="字一色真胡";
        LabelArray["ZYSSiGuiQD"]="字一色真胡四归一七对";
        LabelArray["ZYSBaGuiQD"]="字一色真胡八归一七对";
        LabelArray["ZYSShiErGuiQD"]="字一色真胡十二归一七对";
        LabelArray["ZYSZhenSiGui"]="字一色真胡四归一";
        LabelArray["ZYSZhenBaGui"]="字一色真胡八归一";
        LabelArray["ZYSZhenShiErGui"]="字一色真胡十二归一";
        
        LabelArray["ZYSJia"]="字一色假胡";
        LabelArray["ZYSJiaSiGui"]="字一色假胡四归一";
        LabelArray["ZYSJiaBaGui"]="字一色假胡八归一";
        LabelArray["ZYSJiaShiErGui"]="字一色假胡十二归一";

        LabelArray["QDZYS"]="七对字一色";
        LabelArray["QDShiErGui"]="七对十二归一";
        LabelArray["QDBaGui"]="七对八归一";
        LabelArray["QDSiGui"]="七对四归一";
        LabelArray["QDQYS"]="七对清一色";
        LabelArray["QD"]="七对";

        LabelArray["ShiErGui"]="十二归一";
        LabelArray["BaGui"]="八归一";
        LabelArray["SiGui"]="四归一";
        LabelArray["PingHu"]="平胡";
        LabelArray["TianHu"]="天胡";
        LabelArray["DiHu"]="地胡";
        return LabelArray[huType];
    },
});
