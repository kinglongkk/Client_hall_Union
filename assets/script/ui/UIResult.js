var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        bg:cc.Node,
        btn_look:cc.Node,
        btn_jiesuan:cc.Node,
        lb_name:cc.Label,
        la_jifen:cc.Label,

        sp_type_bg1:cc.Node,
        sp_type_bg2:cc.Node,
        sp_type_bg3:cc.Node,

        zimo:cc.Node,
        sihongzhong:cc.Node,
        qiangganghu:cc.Node,
        qidui:cc.Node,
	    sp_result:cc.Node,
	    nd_meinv:cc.Node,

	    huangzuang:cc.Node,

        seat:cc.Sprite,
        benjiasheng:cc.SpriteFrame,
        xiajiasheng:cc.SpriteFrame,
        duijiasheng:cc.SpriteFrame,
        shangjiasheng:cc.SpriteFrame,
        sheng:cc.Sprite,
        sheng1:cc.SpriteFrame,
        sheng2:cc.SpriteFrame,

        sp_man_number:cc.Label,

        lb_manum01:cc.Label,
        lb_manum02:cc.Label,
        lb_manum03:cc.Label,
        lb_manum04:cc.Label,

        btn_head:cc.Node,
    //    shandianLabel:cc.Label,

        nd_card:cc.Node,

        btn_goon:cc.Node,
        btn_exit:cc.Node,
    },

    OnCreateInit: function () {
        this.FormManager = app.FormManager();
	    this.MaCount = 8;

       /* this.btn_look.on("touchstart", this.Event_TouchStart, this);
        this.btn_look.on("touchend", this.Event_TouchEnd, this);
        this.btn_look.on("touchcancel", this.Event_TouchEnd, this);*/

        this.RegEvent("RoomEnd", this.Event_RoomEnd);

        this.HZRoomMgr = app.HZRoomMgr();
        this.ComTool = app.ComTool();

        this.WeChatHeadImage = this.btn_head.getComponent("WeChatHeadImage");

    },
    //-----------回调函数------------------
    Event_RoomEnd:function () {
        this.ShowBtnGoonExit();
    },
    Click_btn_look:function () {
        this.bg.active = false;
        this.btn_look.active=false;
        this.btn_jiesuan.active=true;
    },
    Click_btn_jiesuan:function () {
        this.bg.active = true;
        this.btn_look.active=true;
        this.btn_jiesuan.active=false;
    },
    Event_TouchStart:function () {
        this.bg.active = false;
    },
    Event_TouchEnd:function () {
        this.bg.active = true;
    },

    OnShow: function () {

        this.ShowBtnGoonExit();

        this.InitShowPlayerInfo();

        this.ShowPlayerZiMo();
    },
    ShowBtnGoonExit:function () {
        let state = app.HZRoomMgr().GetEnterRoom().GetRoomProperty("state");
        if(state == this.ShareDefine.RoomState_End){
            this.btn_goon.active = 0;
            this.btn_exit.active = 1;
        }
        else {
            this.btn_goon.active = 1;
            this.btn_exit.active = 0;
        }
    },
    InitShowPlayerInfo:function () {
        this.lb_manum01.string = "";
        this.lb_manum02.string = "";
        this.lb_manum03.string = "";
        this.lb_manum04.string = "";

        this.lb_name.string = "";
        this.la_jifen.string = "";
    },
    ShowPlayerZiMo:function () {
        let RoomPosMgr = this.HZRoomMgr.GetEnterRoom().GetRoomPosMgr();
        let clientPos = RoomPosMgr.GetClientPos();
        let clientDownPos = RoomPosMgr.GetClientDownPos();
        let clientFacePos = RoomPosMgr.GetClientFacePos();
        let clientUpPos = RoomPosMgr.GetClientUpPos();

        let roomSet = this.HZRoomMgr.GetEnterRoom().GetRoomSet();
        let setEnd = roomSet.GetRoomSetProperty("setEnd");
        let posHuList = setEnd["posHuList"];


        let huPos = -1;
        let huType = "";
        let zhongMa = 0;
        let maCardList = [];
	    let posCount = posHuList.length;

	    let allPosInfo = {};

	    for(let index=0; index<posCount; index++){
		    let posInfo = posHuList[index];
			let pos = posInfo["pos"];
		    let posHuType = posInfo["huType"];

		    allPosInfo[pos] = posInfo;

		    if(posHuType != this.ShareDefine.HuType_NotHu){
			    huPos = pos;
			    huType = posHuType;
			    zhongMa = posInfo["zhongMa"];
			    maCardList = posInfo["maCardList"];
			    // break
		    }

	    }

        this.Check_HuType(huType);
	    let clientPoint = allPosInfo[clientPos]["point"];
	    let clientDownPoint = allPosInfo[clientDownPos]["point"];
	    let clientFacePoint = allPosInfo[clientFacePos]["point"];
	    let clientUpPoint = allPosInfo[clientUpPos]["point"];

	    let point1 = clientPoint > 0 ? ["+", clientPoint].join("") : clientPoint;
	    let point2 = clientDownPoint > 0 ? ["+", clientDownPoint].join("") : clientDownPoint;
	    let point3 = clientFacePoint > 0 ? ["+", clientFacePoint].join("") : clientFacePoint;
	    let point4 = clientUpPoint > 0 ? ["+", clientUpPoint].join("") : clientUpPoint;

	    this.ShowPosInfo(point1, point2, point3, point4);

	//    this.shandianLabel.string = allPosInfo[clientPos]["flashCnt"];

	    //如果有人胡了
	    if(huPos != -1){
            app.SoundManager().PlaySound("shengli");
		    this.sp_man_number.string =  zhongMa;

		    let huPlayerInfo = this.HZRoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(huPos);
		    this.lb_name.string = huPlayerInfo["name"];
		    let pid = huPlayerInfo["pid"];
		    this.WeChatHeadImage.ShowHeroHead(pid);

		    let huPoint = allPosInfo[huPos]["point"];
		    this.la_jifen.string = huPoint > 0 ? ["+",huPoint].join("") : huPoint;
            console.log("huPos:",huPos);
            console.log("clientPos:",clientPos);
            console.log("clientDownPos:",clientDownPos);
            console.log("clientFacePos:",clientFacePos);
            console.log("clientUpPos:",clientUpPos);
		    if(huPos == clientPos){
			    this.seat.spriteFrame = this.benjiasheng;
			    this.sheng.spriteFrame = this.sheng1;
		    }
		    else if(huPos == clientDownPos){
			    this.seat.spriteFrame = this.xiajiasheng;
			    this.sheng.spriteFrame = this.sheng2;
		    }
		    else if(huPos == clientFacePos){
		        
			    this.seat.spriteFrame = this.duijiasheng;
			    this.sheng.spriteFrame = this.sheng2;
			    
		    }
		    else if(huPos == clientUpPos){
			    this.seat.spriteFrame = this.shangjiasheng;
			    this.sheng.spriteFrame = this.sheng2;
		    }
		    let roomConfig = this.HZRoomMgr.GetEnterRoom().GetRoomConfig();
		    let zhama = roomConfig["zhama"];
		    if(
			    zhama == this.ShareDefine.HZZhaMa_TwoMa
			    ||
			    zhama == this.ShareDefine.HZZhaMa_FourMa
			    ||
			    zhama == this.ShareDefine.HZZhaMa_SixMa
		    ){
			    this.sp_type_bg1.active = 0;
			    this.sp_type_bg2.active = 0;
			    this.sp_type_bg3.active = 1;
		    }
		    else if(zhama == this.ShareDefine.HZZhaMa_Ymqz){
			    this.sp_type_bg1.active = 0;
			    this.sp_type_bg2.active = 1;
			    this.sp_type_bg3.active = 0;
		    }
		    else if(zhama == this.ShareDefine.HZZhaMa_Yzdm){
			    this.sp_type_bg1.active = 1;
			    this.sp_type_bg2.active = 0;
			    this.sp_type_bg3.active = 0;
		    }

		    let maCount = maCardList.length;
		    if(maCount == 1){
                let value = ["CardShow", Math.floor(maCardList[0]/100)].join("");
                let path = "bg/sp_result/sp_dingma/nd_card/sp_card01";
                this.SetWndProperty(path, "active", 1);
                this.SetWndProperty(path, "image", value);
            }
            else if(maCount > 1){
                for(let i = 0; i < maCount; i++){
                    let pai = maCardList[i].toString();
                    let paiType = pai.charAt(1);
                    let path = this.ComTool.StringAddNumSuffix("bg/sp_result/sp_dingma/nd_card/sp_card", i+1, 2);
                    if(paiType == 1 || paiType == 5 || paiType == 9){
                        let value = ["CardShow", Math.floor(maCardList[i]/100)].join("");

                        this.SetWndProperty(path, "active", 1);
                        this.SetWndProperty(path, "image", value);
                    }
                    else{
                        this.SetWndProperty(path, "active", 0);
                    }
                }
            }
            else{
                this.Log("maCardList not find", maCardList);
            }


		    for(let index=maCount+1; index <= this.MaCount; index++){
			    let path = this.ComTool.StringAddNumSuffix("bg/sp_result/sp_dingma/nd_card/sp_card", index, 2);
			    this.SetWndProperty(path, "active", 0);
		    }
	    }
    },

	ShowPosInfo:function (pos1Point, pos2Point, pos3Point, pos4Point) {
		this.lb_manum01.string = pos1Point;
		this.lb_manum02.string = pos2Point;
		this.lb_manum03.string = pos3Point;
		this.lb_manum04.string = pos4Point;
	},

    Check_HuType:function (huType) {
        if(huType == this.ShareDefine.HuType_ZiMo){
	        this.huangzuang.active = 0;
	        this.nd_meinv.active = 1;
	        this.sp_result.active = 1;

            this.zimo.active = 1;
            this.qiangganghu.active = 0;
            this.qidui.active = 0;
            this.sihongzhong.active = 0;
        }
        else if(huType == this.ShareDefine.HuType_QGH){
	        this.huangzuang.active = 0;
	        this.nd_meinv.active = 1;
	        this.sp_result.active = 1;

            this.zimo.active = 0;
            this.qiangganghu.active = 1;
            this.qidui.active = 0;
            this.sihongzhong.active = 0;
        }
        else if(huType == this.ShareDefine.HuType_FHZ){
	        this.huangzuang.active = 0;
	        this.nd_meinv.active = 1;
	        this.sp_result.active = 1;

            this.zimo.active = 0;
            this.qiangganghu.active = 0;
            this.qidui.active = 0;
            this.sihongzhong.active = 1;

        }
        //荒庄
        else {
            app.SoundManager().PlaySound("lost");
	        this.huangzuang.active = 1;
	        this.nd_meinv.active = 0;
	        this.sp_result.active = 0;
        }
    },
    //---------设置接口---------------

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_goon"){
            this.Click_btn_goon();
            this.CloseForm();
        }
        else if(btnName == "btn_exit"){
            this.FormManager.ShowForm("UIResultTotal");
            this.CloseForm();
        }
         else if(btnName == "btn_look"){
            this.Click_btn_look();
	    }else if(btnName == "btn_jiesuan"){
	        this.Click_btn_jiesuan();
	    }
        else{
                            console.error("OnClick not find btnName",btnName);
        }
    },
    Click_btn_goon:function () {
        let room = this.HZRoomMgr.GetEnterRoom();
        if(!room){
                            console.error("Click_btn_ready not enter room");
            return
        }
        let roomID = room.GetRoomProperty("roomID");

        //this.HZRoomMgr.SendContinueGame(roomID);
        app.GameManager().SendContinueGame(roomID);
    },

});
