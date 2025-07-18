/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
        icon_piao:[cc.SpriteFrame],
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
	},
    ShowPlayerHuImg:function(huNode,huTypeName,isPingHu){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType=this.ShareDefine.HuTypeStringDict[huTypeName];
        if(typeof(huType)=="undefined"){
            huNode.getComponent(cc.Label).string = '';
        }else if(huType == this.ShareDefine.HuType_DianPao){
            if(isPingHu){
                huNode.getComponent(cc.Label).string = '';
            }else{
                huNode.getComponent(cc.Label).string = '点泡';
            }
        }else if(huType == this.ShareDefine.HuType_JiePao){
            if(isPingHu){
                huNode.getComponent(cc.Label).string = '胡';
            }else{
                huNode.getComponent(cc.Label).string = '接炮';
            }
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
        if (posResultList[index]["isTing"] && posResultList[index]["huType"] == "ZiMo") {
            this.ShowPlayerMaPai(this.node.getChildByName('maPai'), setEnd.maiMa);
        }else{
            this.node.getChildByName('maPai').active = false;
        }
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode=this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode,posResultList[index]['huType'], posResultList[index].isPingHu);

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
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof (HuList.sportsPointTemp) != "undefined") {
            if (HuList.sportsPointTemp > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
            }
        }else if (typeof (HuList.sportsPoint) != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
    },
    ShowPlayerMaPai: function (showNode, maPai) {
        if (maPai <= 0) {
            showNode.active = false;
            return;
        }
        showNode.active = 1;
        let childNode = showNode.getChildByName("card01");
        childNode.active = 1;
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
                            console.error("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        let imageInfo = this.IntegrateImage["EatCard_Self_"+maPai];
        if (!imageInfo) {
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + "EatCard_Self_"+maPai]) {
            childSprite.spriteFrame = app['majiang_' + "EatCard_Self_"+maPai];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                })
                .catch(function (error) {
                    that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                });
        }
    },
    ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"],PlayerInfo["name"]);        
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        let isTing = HuList["isTing"];
        ShowNode.getChildByName('img_ting').active = isTing;
        let piao = HuList["piao"];
        if (piao > 0) {
            ShowNode.getChildByName('img_piao').getComponent(cc.Sprite).spriteFrame=this.icon_piao[piao];
            ShowNode.getChildByName('img_piao').active = true;
        }else{
            ShowNode.getChildByName('img_piao').active = false;
        }
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll['endPoint'].huTypeMap;
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if(huType == "AnGang" || huType == "Gang" || huType == "DianGang" || huType == "JieGang" || huType == "DiFen"
                 || huType == "BaoHu"){
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"： "+huPoint);
            }else if (huType == "GSKH") {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"：x"+huPoint);
            }else if (huType == "ZiMo" || huType == "Hu" ) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"("+huPoint+"家)");
            }else{
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType));
            }
        }
    },
    LabelName:function(huType){
        let LabelArray=[];
        LabelArray['AnGang']='暗杠';
        LabelArray['JieGang']='接杠';
        LabelArray['Gang']='碰杠';
        LabelArray['AnGang']='暗杠';
        LabelArray['DianGang']='点杠';
        LabelArray['PingHu']='平胡';
        LabelArray['PPHu']='碰碰胡';
        LabelArray['KaWuXing']='卡五星';
        LabelArray['LiangDao']='亮倒';
        LabelArray['ShouZhuaYi']='手抓一';
        LabelArray['QYS']='清一色';
        LabelArray['QDHu']='七对胡';
        LabelArray['HDDHu']='豪华七小对';
        LabelArray['CHDDHu']='超级豪华对对胡';
        LabelArray['CCHDDHu']='超超级豪华对对胡';
        LabelArray['GSP']='杠上炮';
        LabelArray['QGH']='抢杠胡';
        LabelArray['DaSanYuan']='大三元';
        LabelArray['XiaoSanYuan']='小三元';
        LabelArray['MaiMa']='买马';
        LabelArray['ZiMo']='自摸';
        LabelArray['Hu']='胡';
        LabelArray['GSKH']='杠上花';
        LabelArray['SiMingGuiYi']='四明归一（全频道）';
        LabelArray['AnSiGuiYi']='暗四归一（全频道）';
        LabelArray['SiMingGuiYiB']='四明归一（半频道）';
        LabelArray['AnSiGuiYiB']='暗四归一（半频道）';
        LabelArray['DiFen']='底分';
        LabelArray['BaoHu']='包胡';
        return LabelArray[huType];
    },
});
