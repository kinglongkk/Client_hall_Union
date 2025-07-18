/*
    UILogin02 登陆界面
*/
var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        btnLogin:cc.Button,
        toggle_agrgee:cc.Toggle,
        btn_userAgree:cc.Button
    },

	OnCreateInit:function(){
		this.SDKManager = app.SDKManager();
		this.RegEvent("CodeError", this.Event_CodeError);
		this.RegEvent("ConnectFail", this.Event_ConnectFail);
		this.RegEvent("ChangeBtnState", this.Event_ChangeBtnState);
	},

	//登录错误码
	Event_CodeError:function(event){
		let argDict = event.detail;
		let code = argDict["Code"];
		if(code == this.ShareDefine.KickOut_ServerClose){
			this.WaitForConfirm("Code_10016", [], [], this.ShareDefine.ConfirmYN)
		}
	},

	//连接服务器失败
	Event_ConnectFail:function(event){
		let argDict = event.detail;
		if(!argDict['bCloseByLogout'])
			this.ShowSysMsg("Net_ConnectFail");
		app.Client.OnEvent("ChangeBtnState", {"state":0});
		//关闭模态层
		app.Client.OnEvent("ModalLayer", "ReceiveNet");
	},

	//设置登录按钮的可点击状态
    Event_ChangeBtnState:function(event)
    {
    	let BtnState = event.detail["state"];
    	this.SysLog("Event_ChangeBtnState BtnState:%s",BtnState);

    	let isWebAnstanll = app.NativeManager().CallToNative("isWXAppInstalled", []);

    	if (BtnState == 1) {
    		this.btnLogin.interactable = 0;
        	this.btnLogin.enableAutoGrayEffect = 1;
    	} else if(isWebAnstanll) {
    		this.btnLogin.interactable = 1;
        	this.btnLogin.enableAutoGrayEffect = 0;
        	//关闭模态层
			app.Client.OnEvent("ModalLayer", "ReceiveNet");
    	}
    },
    OnShow:function(){
    	this.toggle_agrgee.isChecked = true;
    	console.log("UILogin01 OnShow");

    	let isWebAnstanll = app.NativeManager().CallToNative("isWXAppInstalled", []);
    	if(!isWebAnstanll){
    		//app.Client.OnEvent("ChangeBtnState", {"state":1});
    		this.btnLogin.node.active = 0;
    	}else{
    		this.btnLogin.node.active = 1;
    	}
    },

    onLoginYouKe:function(){
    	this.SysLog("onLoginYouKe");
    	let HeroAccountManager = app.HeroAccountManager();
    	let accountList = HeroAccountManager.GetLocalAccountList();
        let count = accountList.length;

        let account = "";
        let token = "";

        if(count){
            account = accountList[count-1];
            token = HeroAccountManager.GetAccountToken(account);
	        
	        this.SysLog("onLoginYouKe AccountLogin account:%s, token:%s", account, token);

	        //账号密码登陆
        	HeroAccountManager.AccountLogin(account, token, 1);
        }else{
        	this.SysLog("onLoginYouKe OneKeyRegAccount account:%s, token:%s", account, token);
        	HeroAccountManager.OneKeyRegAccount();
        }
    },

    //---------点击函数---------------------


    OnClick:function(btnName, btnNode){
	    if(btnName == "btn_login"){
	    	if(!this.toggle_agrgee.isChecked){
	    		this.ShowSysMsg("MSG_NOT_USER_AGREE");
	    		return;
	    	}
	    	app.Client.OnEvent("ChangeBtnState", {"state":1});
		    this.SDKManager.LoginBySDK();
			var OnTimer = function(passSecond){
						//app.Client.OnEvent("ChangeBtnState", {"state":0});
						app.HeroAccountManager().IsDoLogining(false);
					};
			this.scheduleOnce(OnTimer, 5.0);  
	    }
		else if(btnName == "btn_login_line"){
	    	if(!cc.sys.isNative){
	    		return;
	    	}
	    	if(!this.toggle_agrgee.isChecked){
	    		this.ShowSysMsg("MSG_NOT_USER_AGREE");
	    		return;
	    	}
	    	app.Client.OnEvent("ChangeBtnState", {"state":1});
		    this.SDKManager.LoginByLineSDK();
			var OnTimer = function(passSecond){
						//app.Client.OnEvent("ChangeBtnState", {"state":0});
						app.HeroAccountManager().IsDoLogining(false);
					};
			this.scheduleOnce(OnTimer, 5.0);  
	    }    
	    else if(btnName == 'btn_user_agree'){
	    	this.FormManager.ShowForm("UIFuWuTiaoKuan");
	    }
	    else if(btnName == 'btn_login_youke'){
	    	this.onLoginYouKe();
	    }else{
		                    console.error("OnClick not find:%s", btnName);
	    }
    },
    
});
