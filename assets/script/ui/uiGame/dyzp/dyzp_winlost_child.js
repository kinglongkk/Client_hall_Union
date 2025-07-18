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
        this.ShareDefine = app.ShareDefine();

        this.IntegrateImagePath = {
            "zi_fangda_19": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_10",
            },
            "zi_fangda_10": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_1",
            },
            "zi_fangda_11": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_2",
            },
            "zi_fangda_12": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_3",
            },
            "zi_fangda_13": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_4",
            },
            "zi_fangda_14": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_5",
            },
            "zi_fangda_15": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_6",
            },
            "zi_fangda_16": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_7",
            },
            "zi_fangda_17": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_8",
            },
            "zi_fangda_18": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_9",
            },

            "zi_fangda_29": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_10",
            },

            "zi_fangda_20": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_1",
            },
            "zi_fangda_21": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_2",
            },
            "zi_fangda_22": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_3",
            },
            "zi_fangda_23": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_4",
            },
            "zi_fangda_24": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_5",
            },
            "zi_fangda_25": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_6",
            },
            "zi_fangda_26": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_7",
            },
            "zi_fangda_27": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_8",
            },
            "zi_fangda_28": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_9",
            },


            "zi_fangda_51": {
                "FilePath": "ui/uiGame/hhhgw/zi/bg_gui",
            },
            "zi_fangda_bg": {
                "FilePath": "ui/uiGame/hhhgw/zi/img_pb",
            }
        };
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        this.node.active = true;
        if (dPos === index) {
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = true;
        } else {
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = false;
        }
        let PlayerInfo = playerAll[index];
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("userinfo").getChildByName("touxiang").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
        //显示名字跟pid
        this.node.getChildByName("userinfo").getChildByName("lb_name").getComponent(cc.Label).string = PlayerInfo.name;
        this.node.getChildByName("userinfo").getChildByName("lb_id").getComponent(cc.Label).string = PlayerInfo.pid;
        this.PlayerData(this.node, posResultList[index], index);
    },
    GetHuTypeDict: function () {
        let huTypeDict = {};
        huTypeDict["HuXi"]="胡息";
        huTypeDict["JiangPai"]="将牌";
        huTypeDict["ZiMo"]="自摸";
        huTypeDict["SSH"]="30胡";
        huTypeDict["SZ"]="三朝";
        huTypeDict["PT"]="飘台";
        huTypeDict["SH"]="十红";
        huTypeDict["SHT"]="十红台";
        huTypeDict["SHP"]="十红飘";
        huTypeDict["CP"]="闯飘";
        huTypeDict["CT"]="闯台";
        huTypeDict["YZY"]="一只眼";
        huTypeDict["YKB"]="一块扁";
        huTypeDict["JJL"]="节节亮";
        huTypeDict["QH"]="全荤";
        huTypeDict["TH"]="全黑";
        huTypeDict["TianHu"]="天胡";
        huTypeDict["DiHu"]="地胡";
        huTypeDict["PH"]="飘胡";
        huTypeDict["TP"]="台胡";
        huTypeDict["CS"]="闯双";
        huTypeDict["DB"]="单倍牌型";
        huTypeDict["SB"]="4倍牌型";
        huTypeDict["YDH"]="一对红";

        return huTypeDict;
    },

    PlayerData: function (PlayerNode, result, pos) {
        PlayerNode.active = true;
        let huType = result.huType;
        if (huType != 0) {
            //显示胡牌分数
            let layout_huinfo = PlayerNode.getChildByName("layout_huinfo");
            let demo_huinfo = this.node.getChildByName("demo_huinfo");
            let huTypeMap = result.endPoint.huTypeMap;
            let huTypeDict = this.GetHuTypeDict();
            layout_huinfo.removeAllChildren();
            for (let huType in huTypeMap) {
                let huPoint = huTypeMap[huType];
                let lb_huInfo = cc.instantiate(demo_huinfo);
                let str = huTypeDict[huType];
                if (huType == "fanXingType") {
                    if (huPoint == 0) str = "上下醒";
                    if (huPoint == 1) str = "跟醒";
                }
                lb_huInfo.getComponent(cc.Label).string = str + "：" + huPoint;
                lb_huInfo.active = true;
                layout_huinfo.addChild(lb_huInfo);
            }
        } else {
            PlayerNode.getChildByName("layout_huinfo").removeAllChildren();
        }
        let point = result.point;
        let sportsPoint = result["sportsPoint"];
        let cardPublicMap = result.endPoint.publicCardList;
        let cardMap = result.endPoint.shouCardList;
        let huCard = result.handCard;
        let layoutyou = PlayerNode.getChildByName("layoutyou");
        layoutyou.removeAllChildren();
        let demo_you = this.node.getChildByName("demo_you");
        // demo_you.x = 0; demo_you.y = 0;
        //碰吃的牌
        let ti=[1,2,3,4];
        let zhao=[5,6,7,8];
        let kan=[9,10,11,12];
        let peng=[13,14,15,16];
        let chi=[17,18,19,20,23];
        let dui=[21];
        let jiao=[22];
        for (let i = 0; i < cardPublicMap.length; i++) {
            let addYou = cc.instantiate(demo_you);
            layoutyou.addChild(addYou);
            let publicInfo = cardPublicMap[i];
            let publicInfoList = publicInfo["cardList"];
            let publicInfoValue = publicInfo["youNum"];

            let opType=publicInfo["type"];

            let cardIDList = publicInfo["cardList"];

            if(ti.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="提";
            }else if(zhao.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="朝";
            }else if(kan.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="坎";
            }else if(peng.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="碰";
            }else if(chi.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="吃";
            }else if(dui.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="对";
            }else if(jiao.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="绞";
            }

            addYou.getChildByName("lb_you").getComponent(cc.Label).string = publicInfoValue;

            let layoutpai = addYou.getChildByName("layoutpai");

            for (let k = 1; k <= 4; k++) {
                let cardChild = layoutpai.getChildByName("card" + k);
                if (typeof (cardIDList[k - 1]) == "undefined") {
                    if (cardChild) {
                        cardChild.active = false;
                    }
                    continue;
                }
                cardChild.cardID = cardIDList[k - 1];
                /*if(opType==this.ShareDefine.OpType_Chi && cardChild.cardID==getCardID){
                    cardChild.color=cc.color(180,180,180);
                }else{
                    cardChild.color=cc.color(255,255,255);
                }*/
                this.ShowOutCardImage(cardChild);
            }

            addYou.active = true;
        }
        //余下的牌
        for (let i = 0; i < cardMap.length; i++) {
            let addYou = cc.instantiate(demo_you);
            let publicInfo = cardMap[i];
            let opType=publicInfo["type"];
            let publicInfoList =publicInfo["cardList"];
            let publicInfoValue = publicInfo["youNum"];
            let cardIDList = publicInfoList;
            if(ti.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="提";
            }else if(zhao.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="朝";
            }else if(kan.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="坎";
            }else if(peng.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="碰";
            }else if(chi.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="吃";
            }else if(dui.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="对";
            }else if(jiao.indexOf(opType)>-1){
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string ="绞";
            }
            addYou.getChildByName("lb_you").getComponent(cc.Label).string = publicInfoValue;
            let child = addYou.getChildByName("layoutpai");

            for (let j = 1; j <= 4; j++) {
                let cardChild = child.getChildByName("card" + j);
                if (typeof (cardIDList[j - 1]) == "undefined") {
                    if (cardChild) {
                        cardChild.active = false;
                    }
                    continue;
                }
                cardChild.cardID = cardIDList[j - 1];
                this.ShowOutCardImage(cardChild);
                //如果是胡的牌。显示胡牌
                if (huCard > 0 && huCard == cardIDList[j - 1]) {
                    cardChild.getChildByName("tip_hu").active = true;
                } else {
                    cardChild.getChildByName("tip_hu").active = false;
                }
            }
            addYou.active = true;
            layoutyou.addChild(addYou);
        }

        //显示总分
        let lb_winpoint = PlayerNode.getChildByName("lb_winpoint");
        let lb_lostpoint = PlayerNode.getChildByName("lb_lostpoint");
        if (point > 0) {
            lb_winpoint.active = true;
            lb_lostpoint.active = false;
            lb_winpoint.getComponent(cc.Label).string = "+" + point;
        } else {
            lb_winpoint.active = false;
            lb_lostpoint.active = true;
            lb_lostpoint.getComponent(cc.Label).string = point;
        }


        //比赛分
        let lb_sportsPoint = PlayerNode.getChildByName("lb_sportsPoint");
        if (typeof (sportsPoint) != "undefined") {
            lb_winpoint.active = false;
            lb_lostpoint.active = false;
            lb_sportsPoint.active = true;
            lb_sportsPoint.getComponent(cc.Label).string = "比赛分:" + sportsPoint;
        } else {
            lb_sportsPoint.active = false;
        }
    },
    ShowOutCardImage: function (childNode) {
        childNode.active = true;
        let imageName = ["zi_fangda_", Math.floor(childNode.cardID / 100)].join("");
        if (childNode.cardID == 0) {
            imageName = ["zi_fangda_bg"].join("");
        }
        let imageInfo = this.IntegrateImagePath[imageName];
        if (!imageInfo) {
                            console.error("ShowOutCardImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        let that = this;
        childNode.getChildByName("hua").getComponent(cc.Sprite).spriteFrame = "";
        let childSprite = childNode.getChildByName("dian").getComponent(cc.Sprite);
        this.SpriteShow(childSprite, imagePath);

    },
    SpriteShow: function (childSprite, imagePath) {
        let that = this;
        app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function (spriteFrame) {
                if (!spriteFrame) {
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return
                }
                childSprite.spriteFrame = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            }
            );
    },
    GetFanXingCardID: function (map) {
        let xingCardList = [];
        for (let key in map) {
            xingCardList.push(parseInt(key));
        }
        return xingCardList;
    },
});
