var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        left_layout:cc.Node,
        right_layout:cc.Node,
        clubDemo:cc.Node,
        roomDemo:cc.Node,

        defaultHead:cc.Prefab,
        left_on:cc.SpriteFrame,
        left_off:cc.SpriteFrame,

        fangka:cc.Node,
        fangkaLabel:cc.Label,
        quanka:cc.Node,
        quankaLabel:cc.Label,
    },
    OnCreateInit: function () {
        this.headPosDatas = {
            UI1:{
                width:90,
                height:90,
                Pos0:{
                    x:0,
                    y:0
                }
            },
            UI2:{
                width:45,
                height:45,
                Pos0:{
                    x:-23,
                    y:0
                },
                Pos1:{
                    x:23,
                    y:0
                }
            },
            UI3:{
                width:45,
                height:45,
                Pos0:{
                    x:0,
                    y:23
                },
                Pos1:{
                    x:-23,
                    y:-23
                },
                Pos2:{
                    x:23,
                    y:-23
                }
            },
            UI4:{
                width:45,
                height:45,
                Pos0:{
                    x:-23,
                    y:23
                },
                Pos1:{
                    x:23,
                    y:23
                },
                Pos2:{
                    x:-23,
                    y:-23
                },
                Pos3:{
                    x:23,
                    y:-23
                }
            },
            UI5:{
                width:30,
                height:30,
                Pos0:{
                    x:-20,
                    y:20
                },
                Pos1:{
                    x:20,
                    y:20
                },
                Pos2:{
                    x:-34,
                    y:-20
                },
                Pos3:{
                    x:0,
                    y:-20
                },
                Pos4:{
                    x:34,
                    y:-20
                }
            },
            UI6:{
                width:30,
                height:30,
                Pos0:{
                    x:-34,
                    y:20
                },
                Pos1:{
                    x:0,
                    y:20
                },
                Pos2:{
                    x:34,
                    y:20
                },
                Pos3:{
                    x:-34,
                    y:-20
                },
                Pos4:{
                    x:0,
                    y:-20
                },
                Pos5:{
                    x:34,
                    y:-20
                }
            },
            UI7:{
                width:30,
                height:30,
                Pos0:{
                    x:-34,
                    y:34
                },
                Pos1:{
                    x:0,
                    y:34
                },
                Pos2:{
                    x:34,
                    y:34
                },
                Pos3:{
                    x:-34,
                    y:0
                },
                Pos4:{
                    x:0,
                    y:0
                },
                Pos5:{
                    x:34,
                    y:0
                },
                Pos6:{
                    x:-34,
                    y:-34
                }
            },
            UI8:{
                width:30,
                height:30,
                Pos0:{
                    x:-34,
                    y:34
                },
                Pos1:{
                    x:0,
                    y:34
                },
                Pos2:{
                    x:34,
                    y:34
                },
                Pos3:{
                    x:-34,
                    y:0
                },
                Pos4:{
                    x:0,
                    y:0
                },
                Pos5:{
                    x:34,
                    y:0
                },
                Pos6:{
                    x:-34,
                    y:-34
                },
                Pos7:{
                    x:0,
                    y:-34
                }
            },
            UI9:{
                width:30,
                height:30,
                Pos0:{
                    x:-34,
                    y:34
                },
                Pos1:{
                    x:0,
                    y:34
                },
                Pos2:{
                    x:34,
                    y:34
                },
                Pos3:{
                    x:-34,
                    y:0
                },
                Pos4:{
                    x:0,
                    y:0
                },
                Pos5:{
                    x:34,
                    y:0
                },
                Pos6:{
                    x:-34,
                    y:-34
                },
                Pos7:{
                    x:0,
                    y:-34
                },
                Pos8:{
                    x:34,
                    y:-34
                }
            }
        };


        this.clubDemo.active=false;
        this.roomDemo.active=false;
        //this.RegEvent("OnClubPlayerNtf", this.Event_PlayerNtf);

        this.RegEvent('OnAllClubData',this.Event_AllClubDataNtf);
        this.WeChatManager = app.WeChatManager();
        this.RegEvent("OnClubRoomData", this.Event_InitClubRoom, this);
        this.RegEvent("OnRoomStateChange", this.Event_RoomStatusChange, this);
        this.RegEvent("OnRoomPlayerChange", this.Event_RoomPlayerChange, this);
        this.RegEvent("OnRoomSetChange", this.Event_RoomSetChange, this);
        this.RegEvent("OnClubRoomCardNtf", this.Event_ClubCardNtf, this);
        this.RegEvent("OnClubPlayerNtf", this.Event_ClubPlayerNtf, this);
    },
    //-----------------显示函数------------------
    OnShow: function () {
        let last_club_data = app.ClubManager().GetLastClubData();
        if (last_club_data != null) {
            this.nowClubID = last_club_data.club_data.id;
            this.nowClubName = last_club_data.club_data.name;
            this.nowCLubSign = last_club_data.club_data.clubsign;
        }else{
            let clubData = app.ClubManager().GetClubData();
            this.nowClubID = clubData[0].id;
            this.nowClubName = clubData[0].name;
            this.nowCLubSign = clubData[0].clubsign;
        }
        cc.sys.localStorage.setItem('club_moban',1);

        if(!this.nowClubID){
            this.nowClubID=-1;
        }
        this.FormManager.CloseForm("UINoticeBar");
        this.FormManager.CloseForm("bottom");
        this.roomList=[];
        //this.left_layout.removeAllChildren();
        //this.right_layout.removeAllChildren();
        this.DestroyAllChildren(this.left_layout);
        this.DestroyAllChildren(this.right_layout);
        app.ClubManager().SendReqClubData();
        //app.ClubManager().SendGetAllRoom();
    },
    Event_AllClubDataNtf:function(){
        this.UpdateClubList();
    },
    Event_InitClubRoom:function(serverPack){
        serverPack = serverPack;
        let clubroomList=[];
        if(serverPack.hasOwnProperty('roomList')){
            //let clubroomList=serverPack.roomList;
            for(let i=0;i<serverPack.roomList.length;i++){
                if(serverPack.roomList[i].clubId==this.nowClubID){
                    clubroomList.push(serverPack.roomList[i]);
                }
            }
        }
        this.roomList=clubroomList;
        this.ShowScrollData();
    },
    GameType2Name:function(gameType){
        let gameTypeID=this.ShareDefine.GametTypeNameDict[gameType];
        return this.ShareDefine.GametTypeID2Name[gameTypeID];
    },
    GetWanFa:function(gameType,gameCfg){
        let wanfa=app.RoomCfgManager().WanFa(gameType,gameCfg);
        return wanfa;
    },
    InitHead:function(node,playerNum,posList){
        if(playerNum==2){
            node.getChildByName('head_layout').getChildByName('head3').active=false;
            node.getChildByName('head_layout').getChildByName('head4').active=false;
            node.getChildByName('head_layout').getChildByName('head5').active=false;
        }else if(playerNum==3){
            node.getChildByName('head_layout').getChildByName('head4').active=false;
            node.getChildByName('head_layout').getChildByName('head5').active=false;
        }else if(playerNum==4){
            node.getChildByName('head_layout').getChildByName('head5').active=false;
        }
        //posList
        for(let i=0;i<posList.length;i++){
            if(i>3){
                break;
            }
            let heroID = posList[i]["pid"];
            let headImageUrl = posList[i]["headImageUrl"];
            if(heroID>0){
                let touxiang=node.getChildByName('head_layout').getChildByName('head'+(i+1));
                this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                let WeChatHeadImage=touxiang.getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
            }
        }
    },
    Event_ClubPlayerNtf:function(event){
        let status = event.clubPlayerInfo.status;
        let pid = event.clubPlayerInfo.shortPlayer.pid;
        let selfPid = app.HeroManager().GetHeroProperty("pid");
        if(selfPid == pid){
            if(app.ClubManager().Enum_Join == status ||
                app.ClubManager().Enum_Kick == status ||
                app.ClubManager().Enum_Leave == status){
                app.ClubManager().SendGetAllRoom();
                app.ClubManager().SendReqClubData();
            } 
        }
    },
    Event_ClubCardNtf:function(serverPack){
        let clubData = app.ClubManager().GetClubData();
        let datas = serverPack.roomCardAttentions;
        let selfPid = app.HeroManager().GetHeroProperty("pid");
        this.clubCardNtfs = [];
        for(let i=0;i<clubData.length;i++){
            for(let j=0;j<datas.length;j++){
                if(clubData[i].id == datas[j].clubId && datas[j].roomcard <= datas[j].roomcardattention){
                    let isMag = app.ClubManager().IsManager(datas[j].clubId,selfPid);
                    if(isMag)
                        this.clubCardNtfs.push(datas[j]);
                    break;
                } 
            }
        }
        
        if(0 != this.clubCardNtfs.length){
            this.SetWaitForConfirm(
                'MSG_CLUB_RoomCard_Not_Enough',
                this.ShareDefine.ConfirmOK,
                [this.clubCardNtfs[0].clubName,this.clubCardNtfs[0].roomcardattention],
                [this.clubCardNtfs[0].clubId],
            );
        }
    },
    Event_RoomStatusChange:function(serverPack){
        //this.roomList
        let roomData=serverPack.clubRoomInfo;
        let isClose=roomData.isClose;
        let length=this.roomList.length;
        let isChange=false;
        for(let i=0;i<length;i++){
            if(roomData.roomKey==this.roomList[i].roomKey){
                if(isClose==true){
                    this.roomList.splice(i,1);
                    break;
                }else{
                    this.roomList[i]=roomData;
                    isChange=true;
                    break;
                }
            }
        }
        if(isChange==false && isClose==false){
            this.roomList.push(roomData);
        }
        this.ShowScrollData();
    },
    Event_RoomSetChange:function(serverPack){
        let roomData=serverPack;
        let length=this.roomList.length;
        for(let i=0;i<length;i++){
            if(roomData.roomKey==this.roomList[i].roomKey){
                this.roomList[i].setID=roomData.setID;
                break;
            }
        }
        this.ShowScrollData();
    },
    Event_RoomPlayerChange:function(serverPack){
        serverPack = serverPack;
        console.log(this.roomList);
        if(this.roomList.length==0){
            this.ShowClubRoom();
            return;
        }else{
            for(let i=0;i<this.roomList.length;i++){
                if(serverPack.roomKey==this.roomList[i].roomKey){
                    this.roomList[i].posList[serverPack['pos'].pos]=serverPack['pos'];
                }
            }
        }
        this.ShowScrollData();
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        if('MSG_CLUB_RoomCard_Not_Enough' == msgID){
            let clubId = backArgList[0];
            for(let i=0;i<this.clubCardNtfs.length;i++){
                if(this.clubCardNtfs[i].clubId == clubId){
                    this.clubCardNtfs.splice(i,1);
                    break;
                }
            }
            if(0 != this.clubCardNtfs.length){
                let data = this.clubCardNtfs[0];
                setTimeout(function(){
                    app.SysNotifyManager().ShowSysMsg('MSG_CLUB_RoomCard_Not_Enough',[data.clubName,data.roomcardattention]);
                },200);
            }
        }
    },
    ShowScrollData:function(){
    	 //this.right_layout.removeAllChildren();
         this.DestroyAllChildren(this.right_layout);
         var GamePlayManager = require('GamePlayManager');
         let ReSortRoomList=this.ReSortRoomList();
         for(let i=0;i<ReSortRoomList.length;i++){
            let club = cc.instantiate(this.roomDemo);
            this.right_layout.addChild(club);
            club.getChildByName('game_name').getComponent(cc.Label).string=this.GameType2Name(ReSortRoomList[i].gameType);
            club.getChildByName('room_key').getComponent(cc.Label).string="房号:"+ReSortRoomList[i].roomKey;
            let setID=ReSortRoomList[i].setID;
            let roomCfg=ReSortRoomList[i].roomCfg;
            club.getChildByName('jushu').getComponent(cc.Label).string="局数:"+setID+'/'+roomCfg.setCount;
            let payType='';
            if(roomCfg.paymentRoomCardType==2){
                payType=',胜家付'+roomCfg.clubWinnerPayConsume+'圈卡';
            }else if(roomCfg.paymentRoomCardType==1){
                payType=',AA付'+roomCfg.clubWinnerPayConsume+'圈卡';
            }else if(roomCfg.paymentRoomCardType==0){
                payType=',管理付';
            }
            club.getChildByName('wanfa').getComponent(cc.Label).string=this.GetWanFa(ReSortRoomList[i].gameType,roomCfg)+payType;
            club.active=true;
            club.name="join_room_"+ReSortRoomList[i].roomKey;
            club.roomKey=ReSortRoomList[i].roomKey;
            if(setID>0){
                club.getChildByName('btn_yaoqing').active=false;
                club.getChildByName('game_now').active=true;
                club.getChildByName('game_wait').active=false;
            }else{
                club.getChildByName('game_now').active=false;
                club.getChildByName('game_wait').active=true;
            }
            this.InitHead(club,roomCfg.playerNum,ReSortRoomList[i].posList);

            //参数传递,邀请使用

            var WeChatShare= GamePlayManager.WeChatShare(ReSortRoomList[i].gameType,roomCfg);
            club.getChildByName('btn_yaoqing').title =WeChatShare['title'];
            club.getChildByName('btn_yaoqing').weChatAppShareUrl =WeChatShare['url'];
            club.getChildByName('btn_yaoqing').setCount =roomCfg.setCount;  //多少局
            club.getChildByName('btn_yaoqing').roomKey =ReSortRoomList[i].roomKey;  //房间号
            club.getChildByName('btn_yaoqing').createType =ReSortRoomList[i].createType;  //房间号
            club.getChildByName('btn_yaoqing').clubName =ReSortRoomList[i].clubName;  //房间号
            club.getChildByName('btn_yaoqing').joinPlayerCount = roomCfg.playerNum;  //几人场
            let haveRen=0;
            for(let j=0;j<ReSortRoomList[i].posList.length;j++){
                if(ReSortRoomList[i].posList[j].pid>0){
                    haveRen++;
                }
            }
            club.getChildByName('btn_yaoqing').que=roomCfg.playerNum-haveRen;
            club.getChildByName('btn_yaoqing').wanfa=this.GetWanFa(ReSortRoomList[i].gameType,roomCfg)+payType;

            //参数传递
            
         }
    },
    ReSortRoomList:function(){
        let that=this;
        this.roomList.sort(function(a,b){
            if(a.setID==0 && b.setID==0){
                return that.PosCount(b.posList)-that.PosCount(a.posList);
            }else{
                return a.setID-b.setID;
            }
            
        });
        return this.roomList;
    },
    PosCount:function(posList){
        let poscount=0;
        for(let i=0;i<posList.length;i++){
            if(posList[i]){
                if(posList[i].pid>0){
                    poscount++;
                }
            }
        }
        if(poscount==4){
            return -1;
        }
        return poscount;
    },
    RefreshLeft:function(){
        //刷新房卡
        for(let i=0;i<this.clubDatas.length;i++){
            if(this.nowClubID==this.clubDatas[i].id){
                if(this.clubDatas[i].playerClubCard>-1){
                    this.fangkaLabel.string=this.clubDatas[i].playerClubCard;
                }
                break;
            }
        }
        if(this.clubDatas.length==0){
            this.nowClubID=-1;
        }
        //刷新房卡
        for(let i=0;i<this.left_layout.children.length;i++){
            let node=this.left_layout.children[i];
            if(node.name=="btn_club_"+this.nowClubID){
                node.getComponent(cc.Sprite).spriteFrame=this.left_on;
            }else{
                node.getComponent(cc.Sprite).spriteFrame=this.left_off;
            }
        }
    },
    AddLittleHead:function(parentNode,headImages){
        let curNum = 0;
        let selectUI = 'UI' + headImages.length.toString();
        for(let i=0;i<headImages.length;i++){
            if(9 == curNum)
                break;
            let nodePrefab = cc.instantiate(this.defaultHead);
            nodePrefab.name = headImages[i].pid.toString();
            let heroID = headImages[i].pid;
            let headImageUrl = headImages[i].iconUrl;
            //位置大小
            let selectPos = 'Pos' + curNum;
            nodePrefab.x = this.headPosDatas[selectUI][selectPos].x;
            nodePrefab.y = this.headPosDatas[selectUI][selectPos].y;
            nodePrefab.width = this.headPosDatas[selectUI].width;
            nodePrefab.height = this.headPosDatas[selectUI].height;
            parentNode.addChild(nodePrefab);
            let WeChatHeadImage = nodePrefab.getComponent("WeChatHeadImage");
            WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID);
            app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
            curNum++;
        }
    },
    UpdateClubList:function(){
        //this.left_layout.removeAllChildren();
        this.DestroyAllChildren(this.left_layout);
        this.clubDatas = app.ClubManager().GetClubData();
        let selfPid = app.HeroManager().GetHeroProperty("pid");
        let joinState = app.ClubManager().Enum_Join;
        if(this.clubDatas.length==0){
            //显示第一次加亲友圈奖励提示
            this.node.getChildByName('tip').active=true;
        }else{
            this.node.getChildByName('tip').active=false;
        }
        if(this.clubDatas.length==0){
            this.fangka.active=false;
        }else{
            this.fangka.active=true;
        }
        for(let i=0;i<this.clubDatas.length;i++){
            if(this.nowClubID<0){
                this.nowClubID=this.clubDatas[i].id;
            }
            let club = cc.instantiate(this.clubDemo);
            club.getChildByName('name').getComponent(cc.Label).string=this.clubDatas[i].name;
            club.getChildByName('id').getComponent(cc.Label).string="ID:"+this.clubDatas[i].clubsign;
            // club.getChildByName('renshu').getComponent(cc.Label).string=this.clubDatas[i].players.length;
            club.getChildByName('quanka').getComponent(cc.Label).string=this.clubDatas[i].playerClubCard;
            club.active=true;
            club.name="btn_club_"+this.clubDatas[i].id;
            club.clubId=this.clubDatas[i].id;
            club.clubSign=this.clubDatas[i].clubsign;

            club.showUplevelId=this.clubDatas[i].showUplevelId;
            club.showClubSign=this.clubDatas[i].showClubSign;

            club.clubName=this.clubDatas[i].name;
            let headImages = this.clubDatas[i].headImages;
            let headNode = club.getChildByName('headNode');
            this.left_layout.addChild(club);
            this.AddLittleHead(headNode,headImages);
        }
        this.RefreshLeft();
        app.ClubManager().SendGetAllRoom();
    },
    Click_btn_JiaRu:function(btnNode){
        let roomKey = btnNode.parent.parent.roomKey;  //房间号
        app.NetManager().SendPack("room.CBaseEnterRoom", {"roomKey":roomKey,"posID":-1});
    },
    Click_btn_YaoQing:function(btnNode){
        let weChatAppShareUrl=btnNode.weChatAppShareUrl;
        let setCount = btnNode.setCount;  //多少局
        let roomKey = btnNode.roomKey;  //房间号
        let joinPlayerCount = btnNode.joinPlayerCount;  //几人场
        let title="";
        //title=title.replace('{房间号}',roomKey);
        let gamedesc ="";
        let que=btnNode.que;
        title="["+btnNode.clubName+"]亲友团,"+roomKey+" "+(joinPlayerCount-que)+"等"+que+"进团";
        console.log("Click_btn_weixin:",title); 
        console.log("Click_btn_weixin:",gamedesc);
        console.log("Click_btn_weixin:",weChatAppShareUrl);
        this.FormManager.ShowForm('UIRoomCopy',roomKey,title,gamedesc,weChatAppShareUrl);
    },
    GetMyminister:function(playerlist){
        let myHeroID=app.HeroManager().GetHeroID();
        for(let i=0;i<playerlist.length;i++){
            if(myHeroID==playerlist[i].shortPlayer.pid){
                return playerlist[i].isminister;
            }
        }
        return 0;
    },
    OnClick:function(btnName, btnNode){
        if('btn_join' == btnName){
            this.FormManager.ShowForm('ui/club/UIJoinClub');
        }else if(btnName.startsWith("join_room_")){
            app.NetManager().SendPack("room.CBaseEnterRoom", {"roomKey":btnNode.roomKey,"posID":-1},function(success){},function(error){
             });
        }else if(btnName.startsWith("btn_club_")){
            let clubId=btnNode.clubId;
            let CLubSign=btnNode.clubSign;
            let clubName=btnNode.clubName;
            let showUplevelId=btnNode.showUplevelId;
            let showClubSign=btnNode.showClubSign;

            this.nowClubID=clubId;
            this.RefreshLeft();
            app.ClubManager().SetLastClubData(clubId, CLubSign, clubName,showUplevelId,showClubSign);
            app.ClubManager().SendGetAllRoom();
        }else if(btnName=="btn_jiemian"){
            this.CloseForm();
            this.FormManager.ShowForm('ui/club/UIClubMain',this.nowClubID);
        }else if(btnName=="btn_yaoqing"){
            this.Click_btn_YaoQing(btnNode);
        }else if(btnName.startsWith("head")){
             this.Click_btn_JiaRu(btnNode);
        }else if(btnName=="btn_back"){
            //this.FormManager.ShowForm("bottom");
            this.CloseForm();
        }else if('btn_create' == btnName){
            app.NetManager().SendPack("family.CPlayerCheckFamilyOwner",{},function(success){
                app.FormManager().ShowForm('ui/club/UIClubCreate', success);
            },function(error){
                //Not_Family_Owner(5113),//不是代理
                //NotExist_Family(5110), // 工会不存在
                app.SysNotifyManager().ShowSysMsg('不是代理或工会不存在，请联系客服');
            });
        }else if(btnName=="btn_manager"){
            if(this.nowClubID<0){
                return;
            }

            let clubData=app.ClubManager().GetClubDataByClubID(this.nowClubID);
            let playerlist=clubData.players;
            playerlist.sort(this.SortPlayerByIsminister);
            this.myisminister=this.GetMyminister(playerlist);
            if(this.myisminister>0){
                this.FormManager.ShowForm('ui/club/UIClubManager',this.nowClubID,'memberlist');
            }else{
                this.FormManager.ShowForm('ui/club/UIClubManager',this.nowClubID,'store');
            }

            this.FormManager.ShowForm('ui/club/UIClubManager',this.nowClubID);
        }else if(btnName=="btn_addRoomCard"){
            if(this.nowClubID<0){
                return;
            }
            this.FormManager.ShowForm('ui/club/UIClubManager',this.nowClubID,'store');
        }
        
    },
});