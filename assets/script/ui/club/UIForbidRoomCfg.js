var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {
        this.selectAllToggle = this.node.getChildByName("topNode").getChildByName("selectAllToggle");
    },

    OnShow: function (clubId, pid) {
        let cfgScrollView = this.node.getChildByName("cfgScrollView");
        let content = cfgScrollView.getChildByName("view").getChildByName("content");
        cfgScrollView.getComponent(cc.ScrollView).scrollToTop();
        content.removeAllChildren();

        this.clubId = clubId;
        let unionSendPackHead = app.ClubManager().GetUnionSendPackHead();
        if (unionSendPackHead.unionId > 0) {
            this.isOpClub = false;
        }else{
            this.isOpClub = true;
        }
        this.pid = parseInt(pid);
        this.curPage = 1;
        this.showCurEnd = true;
        this.showAllEnd = true;
        this.showDataEnd = false;
        this.GetDataList(true);
    },
    GetDataList:function(isRefresh=false){
        let sendPack = {};
        sendPack.opPid = this.pid;
        let self = this;
        if (this.isOpClub) {
            sendPack.clubId = this.clubId;
            app.NetManager().SendPack("club.CClubBanRoomConigList",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack,isRefresh);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
            });
        }else{
            sendPack.opClubId = this.clubId;
            let unionSendPackHead = app.ClubManager().GetUnionSendPackHead();
            sendPack.unionId = unionSendPackHead.unionId;
            sendPack.clubId = unionSendPackHead.clubId;
            app.NetManager().SendPack("union.CUnionBanRoomConigList",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack,isRefresh);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
            });
        }
    },
    UpdateScrollView:function(serverPack, isRefresh){
        this.showDataEnd = false;
        let cfgScrollView = this.node.getChildByName("cfgScrollView");
        let content = cfgScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            cfgScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        let demo = this.node.getChildByName("demo");
        demo.active = false;
        
        if (serverPack.isAll == 1) {
            this.selectAllToggle.getComponent(cc.Toggle).isChecked = true;
        }else{
            this.selectAllToggle.getComponent(cc.Toggle).isChecked = false;
        }
        let unionBanRoomConfigBOList = serverPack.unionBanRoomConfigBOList;
        for (let i = 0; i < unionBanRoomConfigBOList.length; i++) {
            let child = cc.instantiate(demo);
            let cfgObj = JSON.parse(unionBanRoomConfigBOList[i].dataJsonCfg);
            let gameType = app.ShareDefine().GametTypeID2PinYin[unionBanRoomConfigBOList[i].gameId];
            let wanfa=app.RoomCfgManager().WanFa(gameType,cfgObj);
            child.wanfa = wanfa;
            wanfa += "  "+this.GetUnionCfg(cfgObj);
            child.unionCfg = this.GetUnionCfg(cfgObj);
            if(wanfa.length > 16){
                wanfa = wanfa.substring(0,16) + '...';
            }
            let roomName = unionBanRoomConfigBOList[i].roomName;
            if (roomName == "") {
                roomName = app.ShareDefine().GametTypeID2Name[unionBanRoomConfigBOList[i].gameId];
            }
            child.getChildByName("img_bj").getChildByName("lb_roomName").getComponent(cc.Label).string = roomName;
            child.getChildByName("img_bj").getChildByName("lb_roomCfg").getComponent(cc.Label).string = wanfa;
            if (unionBanRoomConfigBOList[i].isBan == 1) {
                child.getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = true;
            }else{
                child.getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = false;
            }

            child.configId = unionBanRoomConfigBOList[i].configId;
            child.active = true;
            content.addChild(child);
        }
        this.showDataEnd = true;
    },
    GetUnionCfg:function(cfgObj){
        let PLDecStr = "";
        PLDecStr += "房间比赛分门槛："+cfgObj.roomSportsThreshold;
        PLDecStr += "，比赛分倍数："+cfgObj.sportsDouble;
        if (typeof(cfgObj.prizePool) == "undefined") {
            cfgObj.prizePool = 0;
        }
        PLDecStr += "，赛事成本："+cfgObj.prizePool;
        PLDecStr += "，房间比赛分消耗：";
        if (cfgObj.roomSportsType == 0) {
            if (typeof(cfgObj.bigWinnerConsumeList) == "undefined" || cfgObj.bigWinnerConsumeList.length <= 0) {
                PLDecStr += "大赢家赢比赛分>="+cfgObj.geWinnerPoint+"时，消耗"+cfgObj.roomSportsBigWinnerConsume;
            }else{
                for (let i = 0; i < cfgObj.bigWinnerConsumeList.length; i++) {
                    PLDecStr += "大赢家赢比赛分>"+cfgObj.bigWinnerConsumeList[i].winScore+"时，消耗比赛分"+cfgObj.bigWinnerConsumeList[i].sportsPoint;
                    if (i < (cfgObj.bigWinnerConsumeList.length - 1)) {
                        PLDecStr += "，";
                    }
                }
            }
        }else{
            PLDecStr += "每人付"+cfgObj.roomSportsEveryoneConsume;
        }
        PLDecStr += "，比赛分低于"+cfgObj.autoDismiss+"自动解散";
        return PLDecStr;
    },
    OnClickSelectAllToggle:function(event){
        if (!this.showDataEnd) return;
        if (!this.showCurEnd) return;
        this.showAllEnd = false;
        let cfgScrollView = this.node.getChildByName("cfgScrollView");
        let content = cfgScrollView.getChildByName("view").getChildByName("content");
        if (this.selectAllToggle.getComponent(cc.Toggle).isChecked) {
            for (let i = 0; i < content.children.length; i++) {
                content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = true;
            }
        }else{
            for (let i = 0; i < content.children.length; i++) {
                content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = false;
            }
        }
        this.showAllEnd = true;
    },
    OnClickSelectToggle:function(event){
        if (!this.showDataEnd) return;
        if (!this.showAllEnd) return;
        this.showCurEnd = false;
        let cfgScrollView = this.node.getChildByName("cfgScrollView");
        let content = cfgScrollView.getChildByName("view").getChildByName("content");
        let isSelectAll = true;
        for (let i = 0; i < content.children.length; i++) {
            if (!content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked) {
                isSelectAll = false;
            }
        }
        this.selectAllToggle.getComponent(cc.Toggle).isChecked = isSelectAll;
        this.showCurEnd = true;
    },
    GetCurSelectForbidList:function(){
        let cfgScrollView = this.node.getChildByName("cfgScrollView");
        let content = cfgScrollView.getChildByName("view").getChildByName("content");
        let configIdList = [];
        for (let i = 0; i < content.children.length; i++) {
            if (content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked) {
                configIdList.push(content.children[i].configId);
            }
        }
        return configIdList;
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_cancel"){
            this.CloseForm();
        }else if(btnName == "btn_sure"){
            let sendPack = {};
            sendPack.opClubId = this.clubId;
            sendPack.opPid = this.pid;
            sendPack.configIdList = this.GetCurSelectForbidList();
            if (this.selectAllToggle.getComponent(cc.Toggle).isChecked) {
                sendPack.isAll = 1;
            }else{
                sendPack.isAll = 0;
            }
            let self = this;
            if (this.isOpClub) {
                sendPack.clubId = this.clubId;
                app.NetManager().SendPack("club.CClubBanRoomConigOp",sendPack, function(serverPack){
                    app.SysNotifyManager().ShowSysMsg("禁止游戏成功",[],3);
                    self.CloseForm();
                }, function(){
                    
                });
            }else{
                sendPack.opClubId = this.clubId;
                let unionSendPackHead = app.ClubManager().GetUnionSendPackHead();
                sendPack.unionId = unionSendPackHead.unionId;
                sendPack.clubId = unionSendPackHead.clubId;
                app.NetManager().SendPack("union.CUnionBanRoomConigOp",sendPack, function(serverPack){
                    app.SysNotifyManager().ShowSysMsg("禁止游戏成功",[],3);
                    self.CloseForm();
                }, function(){
                    
                });
            }
        }else if(btnName == "lb_roomCfg"){
            let wanfaStr = btnNode.parent.parent.wanfa;
            let unionCfgStr = btnNode.parent.parent.unionCfg;
            app.FormManager().ShowForm("ui/club/UIUnionRoomCfgMsg", wanfaStr, unionCfgStr);
        }else{
                            console.error("OnClick(%s) not find", btnName);
        }
    },
});
