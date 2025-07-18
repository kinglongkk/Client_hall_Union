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
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let jin1 = setEnd.jin;
        let jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        this.posCount = posResultList.length;
        for (let i = 0; i < this.posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        let maiMaList = setEnd["maiMaList"] || [];
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maiMaList);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maiMaList = []) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maiMaList, HuList.endPoint, HuList.huType);
        this.ShowPlayerPiaoJingList(PlayerNode.getChildByName('zhongma'), HuList.piaoJingList || [], jin1, jin2);
    },
    ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        let isMingBai = HuList["isMingBai"];
        let isBaoDing = HuList["isBaoDing"];
        let isDisoolve = HuList["isDisoolve"];

        ShowNode.getChildByName('baipai').active = isMingBai;
        ShowNode.getChildByName('baoding').active = isBaoDing;
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;


    },

    ShowPlayerPiaoJingList: function (showNode, piaoJingList, jin1, jin2) {
        for (let i = 1; i <= 8; i++) {
            showNode.getChildByName("card" + i).active = false;
            showNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
            showNode.getChildByName("card" + i).getChildByName("da").active = false;
            showNode.getChildByName("card" + i).getChildByName("icon_fu").active = false;
        }
        for (let i = 0; i < piaoJingList.length; i++) {
            let cardID = piaoJingList[i];
            let node = showNode.getChildByName("card" + (i + 1));
            let cardType = Math.floor(cardID / 100);
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;

            this.ShowJinBgByNode(cardID, node, jin1, jin2);
        }
    },

    ShowJinBgByNode: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        childNode.color = cc.color(255, 255, 255);
        if (childNode.getChildByName("da")) {
            childNode.getChildByName("da").active = false;
        }
        if (childNode.getChildByName("icon_fu")) {
            childNode.getChildByName("icon_fu").active = false;
        }

        if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = true;
            }
        } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("icon_fu")) {
                childNode.getChildByName("icon_fu").active = true;
            }
        }
    },

    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        //买码飘分
        // let maiMa = huInfoAll["maiMa"];
        // let piaoHua = huInfoAll["piaoHua"];
        // let maiMaStr = "";
        // let piaoHuaStr = "";
        // if(maiMa == 1){
        //     maiMaStr = "买2码";
        // }else if(maiMa == 2){
        //     maiMaStr = "买4码";
        // }else if(maiMa == 0){
        //     maiMaStr = "不买";
        // }else{
        //     maiMaStr = "";
        // }
        // if(piaoHua == -1){
        //     piaoHuaStr = "" ;
        // }else if(piaoHua == 0){
        //     piaoHuaStr = "不飘" ;
        // }else{
        //     piaoHuaStr = "飘" + piaoHua + "分" ;
        // }
        // if(maiMaStr != "" || piaoHuaStr != ""){
        //     if(maiMaStr != "" && piaoHuaStr!= ""){
        //         this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + maiMaStr + " " + piaoHuaStr + "]");
        //     }else{
        //         this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + maiMaStr + piaoHuaStr + "]");
        //     }
        // }
        let lastPos = ["HuPaiPoint", "ShangJingPoint", "XiaJingPoint", "BoJingPoint", "GangPoint"];

        let huInfo = huInfoAll['endPoint'].huTypeMap;
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (lastPos.indexOf(huType) != -1) {
                continue;
            }
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }

        for (let i = 0; i < lastPos.length; i++) {
            let huType = lastPos[i];
            let huPoint = huInfo[huType];
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
        }
    },

    ShowLabelName: function (jiesuan, labelText) {
        // if (this.showLabelNum > jiesuan.children.length) {
        //     return;
        // }
        // jiesuan.getChildByName("label_" + this.showLabelNum.toString()).getComponent(cc.Label).string = labelText;
        // this.showLabelNum = this.showLabelNum + 1;
        let item = this.node.getChildByName("label_item");
		let node = cc.instantiate(item);
		node.active = true;
		node.getComponent(cc.Label).string = labelText;
		this.GetWndNode("scrollview/view/label_lists").addChild(node);
    },

    GetWndNode: function (wndPath) {
		let wndNode = cc.find(wndPath, this.node);
		if (!wndNode) {
			console.error("GetWndNode(%s) not find", wndPath);
			return
		}
		return wndNode
	},

    ClearLabelShow: function (jiesuan) {
        // for (let i = 1; i <= jiesuan.children.length; i++) {
        //     jiesuan.getChildByName("label_" + i.toString()).getComponent(cc.Label).string = '';
        // }
		this.GetWndNode("scrollview/view/label_lists").removeAllChildren(false);
    },

    ShowPlayerRecord: function (ShowNode, huInfo) {
        let absNum = Math.abs(huInfo["point"]);
        if (absNum > 10000) {
            let shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
            }
        }
        //显示比赛分
        if (typeof (huInfo.sportsPointTemp) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
            }
        } else if (typeof (huInfo.sportsPoint) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPoint;
            }
        } else {
            ShowNode.getChildByName('tip_sportspoint').active = false;
        }
    },

    ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2) {
        ShowNode.active = 1;
        let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCardByJAMJ(cardIDList, handCard, jin1, jin2);
    },
    ShowPlayerDownCard: function (ShowNode, publishcard, jin1 = 0, jin2 = 0) {
        ShowNode.active = 1;
        let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        UICard_DownCard.ShowDownCardByJAMJ(publishcard, this.posCount, jin1, jin2);
    },

    ShowPlayerNiaoPai: function (ShowNode, maiMaList, endPoint, huType) {
        let zhongMaList = endPoint["zhongMaList"];
        ShowNode.active = false;
        for (let i = 1; i <= 8; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        if (maiMaList.length == 0) {
            console.error("ShowPlayerNiaoPai", maiMaList);
            return;
        }
        huType = this.ShareDefine.HuTypeStringDict[huType];
        //没胡得人不显示
        if (huType == this.ShareDefine.HuType_DianPao || huType == this.ShareDefine.HuType_NotHu) {
            return
        }
        ShowNode.active = true;
        // if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='中码：';
        // }else{
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='';
        //     return;
        // }
        for (let i = 0; i < maiMaList.length; i++) {
            let cardType = maiMaList[i];
            let node = ShowNode.getChildByName("card" + (i + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            if (zhongMaList.indexOf(cardType) > -1) {
                node.color = cc.color(255, 255, 0);
            }
        }
    },
    ShowImage: function (childNode, imageString, cardID) {
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
                            console.error("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        //取卡牌ID的前2位
        let imageName = [imageString, cardID].join("");
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
                            console.error("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
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
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function (huType) {
        let huTypeDict = this.GetHuTypeDict();
        return huTypeDict[huType];
    },

    // GetHuTypeDict -start-
    GetHuTypeDict: function () {
        let huTypeDict = {};
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["DiHu"] = "地胡";
        huTypeDict["PaoHu"] = "炮胡";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["DeGuo"] = "德国";
        huTypeDict["DeGuoJiaFen"] = "德国加分";
        huTypeDict["JingDiao"] = "精吊";
        huTypeDict["GSKH"] = "杠上花";
        huTypeDict["PPHu"] = "大七对";
        huTypeDict["QiDui"] = "七小对";
        huTypeDict["ShiSanLan"] = "十三烂";
        huTypeDict["QiXingShiSanLan"] = "七星十三烂";
        huTypeDict["ZhuangJia"] = "庄家";
        huTypeDict["ZhengBoJing"] = "正博精";
        huTypeDict["FuBoJing"] = "副博精";
        huTypeDict["ChongGuan"] = "冲关";
        huTypeDict["BaWangJing"] = "霸王精";
        huTypeDict["ZhengJing"] = "正精";
        huTypeDict["FuJing"] = "副精";
        huTypeDict["ZhengGangJing"] = "正杠精";
        huTypeDict["FuGangJing"] = "副杠精";
        huTypeDict["QiTaGangJing"] = "其他杠精";
        huTypeDict["ZhiGang"] = "直杠";
        huTypeDict["PengGang"] = "碰杠";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["XiaJingFen"] = "下精分";
        huTypeDict["PaiXingFen"] = "牌型分";
        huTypeDict["JingFen"] = "精分";

        huTypeDict["HuPaiPoint"] = "胡牌分";
        huTypeDict["ShangJingPoint"] = "上精分";
        huTypeDict["XiaJingPoint"] = "下精分";
        huTypeDict["BoJingPoint"] = "博精";
        huTypeDict["GangPoint"] = "杠分";

        return huTypeDict;
    },
    // GetHuTypeDict -end-
});
