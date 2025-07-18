/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        hehuoist_scrollView:cc.ScrollView,
        hehuolist_layout:cc.Node,
        hehuolist_demo:cc.Node,
        lb_search:cc.EditBox,
    },

    //初始化
    OnCreateInit:function(){
        app.Client.RegEvent("OnClubPromotionChange", this.Event_ClubPromotionChange, this);
    },
    Event_ClubPromotionChange:function(event){
        this.ShowHeHuoList();
    },

    //---------显示函数--------------------

    OnShow:function(clubId,partnerPid, myisminister, myisPartner){
        this.clubId = clubId;
        this.partnerPid = partnerPid;
        this.myisminister = myisminister;
        this.myisPartner = myisPartner;
        //如果是创建者打开
        if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
            this.node.getChildByName("bottom").getChildByName("btn_hehuo_yaoqing").active = false;
        }else{
            this.node.getChildByName("bottom").getChildByName("btn_hehuo_yaoqing").active = true;
        }
        this.hehuolist_demo.active = false;
        this.memberPage = 1;
        this.ShowHeHuoList();
    },
    ShowHeHuoList:function(isSearch = false){
        let self=this;
        let lb_searchStr = "";
        if (isSearch) {
            lb_searchStr = this.ComTool.GetBeiZhuID(this.lb_search.string);
            if(isNaN(parseInt(lb_searchStr)) || !app.ComTool().StrIsNumInt(lb_searchStr)){
                app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id", [], 3);
                return;
            }
        }
        app.NetManager().SendPack('club.CClubSubordinateList',{'clubId':this.clubId,"pageNum":this.memberPage,"pid":this.partnerPid,"query":lb_searchStr},function(serverPack){
            if (serverPack.length > 0) {
                self.DestroyAllChildren(self.hehuolist_layout);
            }
            for(let i=0;i<serverPack.length;i++){
                let node=cc.instantiate(self.hehuolist_demo);
                node.active=true;
                self.hehuolist_layout.addChild(node);
 
                let data=serverPack[i];
                let heroID = data["pid"];
                let headImageUrl = data["iconUrl"];
                node.getChildByName('name').getComponent(cc.Label).string=app.ComTool().GetBeiZhuName(heroID,data.name);
                node.getChildByName('id').getComponent(cc.Label).string=app.ComTool().GetPid(heroID)
                node.getChildByName('lb_active').getComponent(cc.Label).string=data.curActiveValue;
                node.heroID=heroID;
                let WeChatHeadImage = node.getChildByName('head').getComponent("WeChatHeadImage");
                 //用户头像创建
                if(heroID && headImageUrl){
                    app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                }
                WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);

                if (heroID == self.partnerPid) {
                    node.getChildByName('btn_hehuo_xiugai').active = false;
                }else{
                    node.getChildByName('btn_hehuo_xiugai').active = true;
                }

                if(app.HeroManager().GetHeroID()==self.partnerPid){
                    node.getChildByName('btn_hehuo_xiugai').getChildByName('label').getComponent(cc.Label).string = "删除下属";
                }

                node.getChildByName('btn_hehuo_xiugai').heroID=heroID;
                node.getChildByName('btn_hehuo_xiugai').heroName=data.name;
            }
        },function(error){

        });
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_next'==btnName){
            this.memberPage=this.memberPage+1;
            this.ShowHeHuoList();
        }else if('btn_last'==btnName){
            if(this.memberPage<=1){
                return;
            }
            this.memberPage=this.memberPage-1;
            this.ShowHeHuoList();
        }else if('btn_hehuo_xiugai'==btnName){
            app.FormManager().ShowForm('ui/club/UIPromoterSet',this.clubId,btnNode.heroID,btnNode.heroName);
        }else if('btn_hehuo_zhanji'==btnName){
            app.FormManager().ShowForm('ui/club/UIPromoterRecordUser',this.clubId,btnNode.parent.heroID,this.partnerPid);
        }else if ('btn_hehuo_yaoqing'==btnName) {
            app.FormManager().ShowForm("ui/club/UIYaoQing",this.clubId, this.partnerPid);
        }else if ('btn_search'==btnName) {
            this.memberPage=1;
            this.ShowHeHuoList(true);
        }else{
			                console.error("OnClick:%s not find", btnName);
		}
	},
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        let self = this;
        if('MSG_CLUB_DelHeHuoXiaShu' == msgID){
            let btnNode = backArgList[0];
            //下属本家可以去除下属
            app.NetManager().SendPack('club.CClubPartnerChange',{"clubId":this.clubId,'pid':btnNode.heroID,"partnerPid":0},function(serverPack){
                btnNode.parent.destroy();
            },function(error){
                self.ShowSysMsg('删除失败，请联系亲友圈创建者');
            });
        }
    },
});
