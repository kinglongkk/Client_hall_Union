var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
    	EditBoxID:cc.EditBox,
        btn_add:cc.Node,
    },

    OnCreateInit: function () {
        this.WeChatManager=app.WeChatManager();
        this.NetManager = app.NetManager();
    },

    OnShow: function (unionId, clubId, groupingId) {
        this.unionId = unionId;
    	this.clubId=clubId;
        this.groupingId = groupingId;
    	this.EditBoxID.string='';
        this.btn_add.active = false;
        this.node.getChildByName('user').active=false;
    },
    ShowUser:function(player){
        let usernode=this.node.getChildByName('user');
        usernode.active=true;
        let heroID = player["pid"];
        usernode.heroID=heroID;
        let headImageUrl = player["iconUrl"];
        usernode.getChildByName('name').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(heroID,player.name);
        usernode.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        let WeChatHeadImage = usernode.getChildByName('head').getComponent("WeChatHeadImage");
         //用户头像创建
        if(heroID && headImageUrl){
            this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
        }
        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
        this.btn_add.active = true;
    },
    click_btn_search:function(){
        let shuru =this.ComTool.GetBeiZhuID(this.EditBoxID.string);
        if(isNaN(parseInt(shuru)) || !app.ComTool().StrIsNum(shuru)){
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id", [], 3);
            return;
        }
        let self=this;
        if (this.unionId > 0) {
            app.NetManager().SendPack('union.CUnionGroupingPidFind',{'unionId':this.unionId,'clubId':this.clubId,"pid":shuru},function(serverPack){
                self.ShowUser(serverPack);
            },function(error){
                
            });
        }else{
            app.NetManager().SendPack('club.CClubGroupingPidFind',{'clubId':this.clubId,"pid":shuru},function(serverPack){
                self.ShowUser(serverPack);
            },function(error){
                
            });
        }
    },
    Click_btn_add:function(){
    	if(this.EditBoxID.string==''){
    		return;
    	}
        let that=this;
        let sendPack={
            "clubId":this.clubId,
            "groupingId":this.groupingId,
            "pid":this.EditBoxID.string,
        };
        if (this.unionId > 0) {
            sendPack.unionId = this.unionId;
            this.NetManager.SendPack("union.CUnionGroupingPidAdd", sendPack,function(success){
                that.btn_add.active = false;
                that.ShowSysMsg("添加成功");
                app.Client.OnEvent('OnUnionForbidReShow', null);
                if(app.FormManager().IsFormShow("ui/club/UIForbidUserList")){
                    app.FormManager().GetFormComponentByFormName("ui/club/UIForbidUserList").GetMemberList();
                }
            },function(error){
                
            });
        }else{
            this.NetManager.SendPack("club.CClubGroupingPidAdd", sendPack,function(success){
                that.btn_add.active = false;
                that.ShowSysMsg("添加成功");
                if(app.FormManager().IsFormShow("ui/club/UIForbidUserList")){
                    app.FormManager().GetFormComponentByFormName("ui/club/UIForbidUserList").GetMemberList();
                }
                if(app.FormManager().IsFormShow("ui/club/UIClubForbid")){
                    app.FormManager().GetFormComponentByFormName("ui/club/UIClubForbid").ShowForbid();
                }
                if(app.FormManager().IsFormShow("ui/club_2/UIClubForbid_2")){
                    app.FormManager().GetFormComponentByFormName("ui/club_2/UIClubForbid_2").ShowForbid();
                }
            },function(error){
                
            });
        }
        
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_add"){
            this.Click_btn_add();
        }else if(btnName == "btn_search"){
            this.click_btn_search();
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
                            console.error("OnClick(%s) not find", btnName);
        }
    },

});
