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
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.showGangNum=1;
	},
    ShowPlayerData:function(setEnd,playerAll,index){
        let jin1=setEnd.jin;
        let jin2=0;
        if(setEnd.jin2>0){
            jin2=setEnd.jin2;
        }
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
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2,setEnd.maPaiLst);
        let huNode=this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode,posResultList[index]["endPoint"]["huTypeMap"]);

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
    ShowPlayerHuImg:function(huNode,huType){
        if(huType.JiePao || huType.ZiMo){
            if(huType.JiePao){
               for(let i=0; i<huType.JiePao.length; i++){
                    huNode.getComponent(cc.Label).string=huType.JiePao[i] + "胡";
               }
            }
            if(huType.ZiMo){
               for(let i=0; i<huType.ZiMo.length; i++){
                    huNode.getComponent(cc.Label).string=huType.ZiMo[i] + "自摸";
               }
            }
        }else{
            huNode.getComponent(cc.Label).string='';
        }
    },
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=huInfoAll['endPoint'].huTypeMap;
        this.ClearGangShow(ShowNode.getChildByName('gang_lists'));
        //番
        if(huInfo.BaoTing){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"报听");
        }
        if(huInfo.DianPao){
            for(let i=0; i<huInfo.DianPao.length; i++){
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),"点炮"+huInfo.DianPao[i]+"胡");
           }
        }
        if(huInfo.ChaHuaZhu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"查花猪");
        }
        if(huInfo.ChaDaJiao){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"查大叫");
        }
        if(huInfo.FanCha){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"反查");
        }
        if(huInfo.DDHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"对对胡"+huInfo.DDHu+"番");
        }
        if(huInfo.QYS){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"清一色"+huInfo.QYS+"番");
        }
        if(huInfo.QiDuiHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"七对"+huInfo.QiDuiHu+"番");
        }
        if(huInfo.QYSDDHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"清一色对对胡"+huInfo.QYSDDHu+"番");
        }
        if(huInfo.LongQiDuiHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"龙七对"+huInfo.LongQiDuiHu+"番");
        }
        if(huInfo.QYSQiDuiHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"清一色七对"+huInfo.QYSQiDuiHu+"番");
        }
        if(huInfo.TianHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"天胡"+huInfo.TianHu+"番");
        }
        if(huInfo.DiHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"地胡"+huInfo.DiHu+"番");
        }
        if(huInfo.QYSLongQiDuiHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"清一色龙七对"+huInfo.QYSLongQiDuiHu+"番");
        }
        if(huInfo.GSKH){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"杠上开花"+huInfo.GSKH+"番");
        }
        if(huInfo.GSP){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"杠上炮"+huInfo.GSP+"番");
        }
        if(huInfo.QGHu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"抢杠胡"+huInfo.QGHu+"番");
        }
        if(huInfo.HDLY){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"海底捞月"+huInfo.HDLY+"番");
        }
        // if(huInfo.ChaHuaZhu){
        //     this.ShowLabelName(ShowNode.getChildByName('label_lists'),"查花猪"+huInfo.ChaHuaZhu+"番");
        // }
        // if(huInfo.ChaDaJiao){
        //     this.ShowLabelName(ShowNode.getChildByName('label_lists'),"查大叫"+huInfo.ChaDaJiao+"番");
        // }
        if(huInfo.JinGouDiao){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"金钩钓"+huInfo.JinGouDiao+"番");
        }
        if(huInfo.DuZhang){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"独张"+huInfo.DuZhang+"番");
        }
        if(huInfo.Long){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"一条龙"+huInfo.Long+"番");
        }
        if(huInfo.BanBanGao){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"板板高"+huInfo.BanBanGao+"番");
        }
        if(huInfo.JiaXinWu){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"夹心五"+huInfo.JiaXinWu+"番");
        }
        // if(huInfo.GangShangPaoZhuanYu){
        //     this.ShowLabelName(ShowNode.getChildByName('label_lists'),"杠上炮转雨"+huInfo.GangShangPaoZhuanYu+"番");
        // }
        if(huInfo.Gen){
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),"根"+huInfo.Gen+"番");
        }
        //杠
        if(huInfo.AnGang){
            this.ShowGangName(ShowNode.getChildByName('gang_lists'),"暗杠",huInfo.AnGang);
        }
        if(huInfo.Gang){
            this.ShowGangName(ShowNode.getChildByName('gang_lists'),"杠",huInfo.Gang);
        }
        if(huInfo.JieGang){
            this.ShowGangName(ShowNode.getChildByName('gang_lists'),"接杠",huInfo.JieGang);
        }
        if(huInfo.DianGang){
            this.ShowGangName(ShowNode.getChildByName('gang_lists'),"点杠",huInfo.DianGang);
        }
    },
    ShowGangName:function(jiesuan,labelText,gangList){
        if(this.showGangNum>3){
            return;
        }
        jiesuan.getChildByName("gang"+this.showGangNum.toString()).getChildByName("lb").getComponent(cc.Label).string=labelText;
        let gangCardID = gangList[0];
        let ImageNode = jiesuan.getChildByName("gang"+this.showGangNum.toString()).getChildByName("bg");
        this.ShowImage(ImageNode,gangCardID)
        this.showGangNum=this.showGangNum+1;
    },
    ClearGangShow:function(jiesuan){
        for(let i=1;i<=3;i++){
            jiesuan.getChildByName("gang"+i.toString()).getChildByName("lb").getComponent(cc.Label).string='';
            jiesuan.getChildByName("gang"+i.toString()).getChildByName("bg").getComponent(cc.Sprite).spriteFrame='';
        }
    },
    ShowImage:function(childNode, cardID){
        let childSprite = childNode.getComponent(cc.Sprite);
        if(!childSprite){
                            console.error("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        let imageString = "EatCard_Self_"
        let imageName = [imageString, cardID].join("");
        let imageInfo = this.IntegrateImage[imageName];
        if(!imageInfo){
                            console.error("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite=app['majiang_' + imageName];
        }else{
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function(spriteFrame){
                    if(!spriteFrame){
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                    app['majiang_' + imageName] = spriteFrame;
                })
                .catch(function(error){
                    that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                }
            );
        }
    },
    LabelName:function(huType){
        let LabelArray=[];
        LabelArray['DDHu']='对对胡';
        LabelArray['QYS']='清一色';
        LabelArray['QiDuiHu']='七对';
        LabelArray['QYSDDHu']='清一色对对胡';
        LabelArray['LongQiDuiHu']='龙七对';
        LabelArray['QYSQiDuiHu']='清一色七对';
        LabelArray['TianHu']='天胡';
        LabelArray['DiHu']='地胡';
        LabelArray['QYSLongQiDuiHu']='清一色龙七对';
        LabelArray['GSKH']='杠上开花';
        LabelArray['GSP']='杠上炮';
        LabelArray['QGHu']='抢杠胡';
        LabelArray['HDLY']='海底捞月';
        LabelArray['JinGouDiao']='金钩钓';
        LabelArray['DuZhang']='独张';
        LabelArray['Long']='一条龙';
        LabelArray['BanBanGao']='板板高';
        LabelArray['JiaXinWu']='夹心五';
        LabelArray['Gen']='根';
        return LabelArray[huType];
    },
});
