/*
小傅最新修改 2017-10-13 
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIDaiKai_Child: cc.Prefab,
        Scrollow:cc.Node,
    },

    OnCreateInit: function () {
       this.FormManager = app.FormManager();
       this.ComTool = app.ComTool();
       this.loopScrollView = this.getComponent("LoopScrollView");
       this.NetManager = app.NetManager();
       this.HeroManager = app.HeroManager(); 
       this.heroID = app.HeroManager().GetHeroProperty("pid");
    },
    OnShow:function(){
		  //获取带开放记录
        this.loopScrollView.InitScrollData("UIDaiKai_Child", this.UIDaiKai_Child,[]);
        this.NetManager.SendPack("helproom.CHelpRoomGetList",{type:1},this.OnPack_HelpRoomList.bind(this),this.OnPack_HelpRoomListFail.bind(this));
    },
    OnPack_HelpRoomList:function(serverPack){
        if(serverPack.hasOwnProperty('helpRoomList')){
            let helpRoomList=serverPack.helpRoomList;
            app['helpRoomList']=helpRoomList;
            let everyGameKeys = Object.keys(helpRoomList);
            this.ScrollViewData(everyGameKeys);
            console.log("everyGameKeys :",everyGameKeys);
        }else{
            //this.Scrollow.removeAllChildren();
            this.DestroyAllChildren(this.Scrollow);
            return;
        }
        
    },
    OnPack_HelpRoomListFail:function(serverPack){
        app['helpRoomList']=false;
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    ScrollViewData:function(everyGameKeys){
        this.loopScrollView.InitScrollData("UIDaiKai_Child", this.UIDaiKai_Child, everyGameKeys);
    },
    InitGameBtnList:function(serverPack){
        this.FormManager.ShowForm("UICreatRoom",serverPack,this.gameName);
    },
    OnClose:function(){
    	this.NetManager.SendPack("helproom.CHelpRoomSession",{type:2});
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_close"){
            this.CloseForm();
        }else if(btnName=="btn_daikaifang"){
			//打开代开放UI
            app.NetManager().SendPack('family.CPlayerGameList',{},this.InitGameBtnList.bind(this),this.InitGameBtnList.bind(this));
            this.FormManager.CloseForm('UIDaiKai');
        }else if(btnName=='btn_jilu'){
			//打开代开放记录
           this.FormManager.ShowForm("UIDaiKaiLog");
		}else{
                            console.error("OnClick(%s) not find btnName",btnName);
        }
    },
});
