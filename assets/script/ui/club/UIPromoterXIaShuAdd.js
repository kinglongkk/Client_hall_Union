var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
       editbox:cc.EditBox,
    },

    OnCreateInit: function () {
        this.WeChatManager=app.WeChatManager();
        this.NetManager=app.NetManager();
    },
    //--------------显示函数-----------------
    OnShow: function (clubId,isShowSelectUser) {
        this.clubId=clubId;
        this.isShowSelectUser=isShowSelectUser;
        if(isShowSelectUser){
            this.node.getChildByName("ToggleContainer").active=true;
        }else{
            this.node.getChildByName("ToggleContainer").active=false;
        }
        this.node.getChildByName('user').active=false;
        this.node.getChildByName('btn_yaoqing').active=false;
        this.editbox.string = "";
    },
    ShowUser:function(data){
        let usernode=this.node.getChildByName('user');
        usernode.active=true;
        let heroID = data.player["pid"];
        usernode.heroID=heroID;
        let headImageUrl = data.player["iconUrl"];
        usernode.getChildByName('name').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(heroID,data.player.name);
        usernode.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        let WeChatHeadImage = usernode.getChildByName('head').getComponent("WeChatHeadImage");
         //用户头像创建
        if(heroID && headImageUrl){
            this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
        }
        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);

        if(data.type==0){
            this.node.getChildByName('btn_yaoqing').active=true;
        }else{
            this.node.getChildByName('btn_yaoqing').active=false;
            if (data.type == 1) {
                app.SysNotifyManager().ShowSysMsg("该玩家已经加入该亲友圈", [], 3);
            }else if (data.type == 2) {
                app.SysNotifyManager().ShowSysMsg("该玩家已经绑定了推广员", [], 3);
            }
        }
    },
    click_btn_search:function(){
        let shuru=this.ComTool.GetBeiZhuID(this.editbox.string);
        if(isNaN(parseInt(shuru)) || !app.ComTool().StrIsNumInt(shuru)){
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id", [], 3);
            return;
        }
        let self=this;
        app.NetManager().SendPack('club.CClubSubordinateLevelPidInfo',{'clubId':this.clubId,"pid":shuru},function(serverPack){
            self.ShowUser(serverPack);
        },function(error){
            
        });
    },
    click_btn_add:function(){
        let type=0;
        if(this.isShowSelectUser){
            if(this.node.getChildByName("ToggleContainer").getChildByName("toggle2").getComponent(cc.Toggle).isChecked==true){
                type=1;
            }
        }
        let sendPack={
            "clubId":this.clubId,
            "pid":this.node.getChildByName('user').heroID,
            "type":type,
        };
        let that=this;
        this.NetManager.SendPack("club.CClubSubordinateLevelPidAdd", sendPack,function(success){
            that.ShowSysMsg("操作成功");
        },function(error){
            that.ShowSysMsg("已邀请或未找到该玩家或同赛事不同亲友圈不能重复拉人或距离退出该亲友圈不到10分钟或该玩家处于赛事黑名单，无法加入亲友圈");
        });
    },
    OnClick:function(btnName, btnNode){
        if('btn_close' == btnName){
           this.CloseForm();
        }else if('btn_search'==btnName){
            this.click_btn_search();
        }else if('btn_yaoqing'==btnName){
            this.click_btn_add();
        }
    },
    
    OnClose:function(){
        
    },
});