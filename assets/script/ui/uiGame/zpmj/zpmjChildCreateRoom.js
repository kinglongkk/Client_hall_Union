/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    OnShow:function(){
        this.zpmjToggleIndex = -1;
    },  
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let taishusuanfa = this.GetIdxByKey('taishusuanfa');
        let suanfenfangsi = this.GetIdxByKey('suanfenfangsi');
        let zhangfenshezhi = this.GetIdxByKey('zhangfenshezhi');
        let angangfenshu = this.GetIdxByKey('angangfenshu');
        let zhuahua = this.GetIdxByKey("zhuahua");
        let jiesan = this.GetIdxByKey('jiesan');
        let xianShi = this.GetIdxByKey('xianShi');
        // let fangjian=[];
        let kexuanwanfa=[];
        let gaoji=[];
        // for(let i=0;i<this.Toggles['fangjian'].length;i++){
        //     if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
        //         fangjian.push(i);
        //     }
        // }
        for(let i=0;i<this.Toggles['gaoji'].length;i++){
            if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                gaoji.push(i);
            }
        }
        for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
            if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
                kexuanwanfa.push(i);
            }
        }
        sendPack = {
                   "taishusuanfa":taishusuanfa,
                    "suanfenfangsi":suanfenfangsi,
                    "zhangfenshezhi":zhangfenshezhi,
                    "angangfenshu":angangfenshu,
                    "zhuahua":zhuahua,
                    "jiesan":jiesan,
                    "xianShi": xianShi,
                    "playerMinNum":renshu[0],
                    "playerNum":renshu[1],
                    "setCount":setCount,
                    "paymentRoomCardType":isSpiltRoomCard,
                    // "fangjian":fangjian,
                    "gaoji":gaoji,
                    "kexuanwanfa":kexuanwanfa,
        };
        return sendPack;
    },
    RefreshAllToggles:function(gameType){
        this.gameType = gameType;
        this.Toggles = {};
        this.scroll_Right.stopAutoScroll();
        //this.node_RightLayout.removeAllChildren();
        this.DestroyAllChildren(this.node_RightLayout);
        let isHideZhadanfenshu = false;
        let isHideCBL = false;//是否隐藏除百六

        let helpIndex = 1;//01是总帮助
        for(let key in this.gameCreateConfig){
            if(this.gameType == this.gameCreateConfig[key].GameName){
                let node = null;
                let dataKey = this.gameCreateConfig[key].Key;
                let toggleCount = this.gameCreateConfig[key].ToggleCount;
                let AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
                let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                if(this.clubData && 'fangfei' == dataKey){
                    toggleCount = 1;  //一个管理付，一个大赢家付
                    AtRows=[1];
                }else if(this.unionData && 'fangfei' == dataKey){
                    toggleCount = 1;  //一个盟主付`
                    AtRows=[1];
                }
                node = cc.instantiate(this.prefab_Toggles);
                node.active = true;
                //需要判断添更加多的Toggle
                let addCount = toggleCount - 1;
                if(addCount < 0)
                    this.ErrLog('gameCreate Config ToggleCount error');
                else{
                    for(let i=2;i<=toggleCount;i++){
                        let prefabNode = node.getChildByName('Toggle1');
                        let newNode = cc.instantiate(prefabNode);
                        newNode.name = 'Toggle' + i;
                        node.addChild(newNode);
                    }
                }
                
                node.name = 'Toggles_' + dataKey;
                node.x = 10;
                let nodeHelp = node.getChildByName('btn_help');
                nodeHelp.active = false;
                if(this.gameCreateConfig[key].IsShowHelp){
                    nodeHelp.name = 'btn_help0' + helpIndex;
                    nodeHelp.on('click',this.OnHelpBtnClick,this);
                    nodeHelp.active = true;
                    helpIndex++;
                }


                if(!this.Toggles[dataKey])
                    this.Toggles[dataKey] = [];

                let fristPos = {x:0,y:0};
                let lastPos = {x:0,y:0};
                for(let i=1; i<=toggleCount; i++){
                    let curNode = node.getChildByName('Toggle' + i);
                    curNode.isFirstNode = false;
                    if(curNode){
                        //位置宽高设置下
                        //记录下第一个的位置方便换行
                        if(1 == i){
                            fristPos.x = curNode.x;
                            fristPos.y = curNode.y;
                            lastPos.x = curNode.x;
                            lastPos.y = curNode.y;
                            curNode.isFirstNode = true;
                        }
                        else if(1 < i){//第1个以后都是新增的
                            if(AtRows[i-2] != AtRows[i-1]){
                                curNode.x = fristPos.x;
                                curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
                                node.height = node.height + curNode.height + this.rightPrefabSpacing;
                                curNode.isFirstNode = true;
                            }
                            else{
                                // if ('fangfei' == dataKey) {
                                //     //房费节点比较长，需要再位移一点
                                //     curNode.x = lastPos.x + this.addPrefabWidth + 80;
                                // }else{
                                //     curNode.x = lastPos.x + this.addPrefabWidth;
                                // }
                                curNode.x = lastPos.x + parseInt(spacing[i-1]);
                                curNode.y = lastPos.y;
                            }
                        }
                        lastPos.x = curNode.x;
                        lastPos.y = curNode.y;
                        
                        curNode.on(cc.Node.EventType.TOUCH_START,this.OnToggleClick,this);
                        let checkNode = curNode.getChildByName('checkmark');
                        let icon_selectBg = curNode.getChildByName('icon_selectBg');
                        let showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
                        //尝试获取缓存
                        let clubId = 0;
                        let roomKey = '0';
                        let unionId = 0;
                        let unionRoomKey = '0';
                        let linshi = null;
                        if(this.clubData){
                            clubId = this.clubData.clubId;
                            roomKey = this.clubData.gameIndex;
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key,clubId,roomKey,unionId,unionRoomKey);
                        }
                        if(this.unionData){
                            unionId = this.unionData.unionId;
                            unionRoomKey = this.unionData.roomKey;
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key,clubId,roomKey,unionId,unionRoomKey);
                        }
                        //第一次创建俱乐部房间没有roomKey为0
                        if(!linshi)
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key,clubId,'0',unionId,unionRoomKey);
                        if(linshi){
                            let linshiList = linshi.split(',');
                            for(let j=0;j<linshiList.length;j++){//缓存可能出BUG(配置删除了按钮数量)
                                if(parseInt(linshiList[j]) > toggleCount){
                                    linshiList = ['1'];
                                    break;
                                }
                            }
                            showList=linshiList;
                        }
                        if(this.clubData && 'fangfei' == dataKey)
                            showList = [1];
                        if(this.unionData && 'fangfei' == dataKey)
                            showList = [1];
                        if (dataKey == 'suanfenfangsi') {
                            if (linshi == 1) {
                                this.zpmjToggleIndex = 0;
                            }
                            if (linshi == 2) {
                                this.zpmjToggleIndex = 1;
                            }
                        }else if(dataKey == "taishusuanfa"){
                            if(parseInt(showList[0]) == 3){
                                isHideCBL = false;
                            }else{
                                isHideCBL = true;
                            }
                        }
                        //尝试获取缓存
                        if(0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length)
                            this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

                        if(1 == this.gameCreateConfig[key].ToggleType){//多选的图片设置下(不放上面是因为路径)
                            let imgPath = 'texture/ui/createRoom/icon_checkin02';
                            node.addComponent(cc.Toggle);
                            this.SetNodeImageByFilePath(checkNode,imgPath);
                            this.SetNodeImageByFilePath(icon_selectBg, 'texture/ui/createRoom/icon_check02');
                        }

                        for(let j=0;j<showList.length;j++){
                            if(i == parseInt(showList[j])){
                                checkNode.active = true;
                                break;
                            }
                            else{
                                checkNode.active = false;
                            }
                        }
                        this.Toggles[dataKey].push(curNode);
                    }
                }
                this.UpdateTogglesLabel(node);
                this.UpdateLabelColor(node);
                this.node_RightLayout.addChild(node);
                let line=this.scroll_Right.node.getChildByName('line');
                let addline=cc.instantiate(line);
                addline.active=true;
                this.node_RightLayout.addChild(addline);
            }
        }
        this.setHelpBtnPos();
        this.scroll_Right.scrollToTop();
        //如果可以滚动，显示滚动提示节点
        if (this.node_RightLayout.height > this.scroll_Right.node.height) {
            this.scrollTip.active = true;
        }else{
            this.scrollTip.active = false;
        }
        if (this.zpmjToggleIndex == 0) {//选择算台制后，下方涨分设置和抓花不可见或不可选
            this.Toggles['zhangfenshezhi'][0].parent.active = false;
            this.Toggles['zhuahua'][0].parent.active = false;
            this.Toggles['angangfenshu'][0].parent.active = true;
        }else{
            this.Toggles['zhangfenshezhi'][0].parent.active = true;
            this.Toggles['zhuahua'][0].parent.active = true;
            this.Toggles['angangfenshu'][0].parent.active = false;
        }
        if(isHideCBL){
             this.Toggles['kexuanwanfa'][6].active = false;
        }else{
             this.Toggles['kexuanwanfa'][6].active = true;
        }
    },
     OnToggleClick:function(event){
        this.FormManager.CloseForm("UIMessageTip");
        let toggles = event.target.parent;
        let toggle = event.target;
        let key = toggles.name.substring(('Toggles_').length,toggles.name.length);
        let toggleIndex = parseInt(toggle.name.substring(('Toggle').length,toggle.name.length)) - 1;
        let needClearList = [];
        let needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if('jushu' == key || 'renshu' == key || 'fangfei' == key){
            this.ClearToggleCheck(needClearList,needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if('kexuanwanfa' == key){
            // if('sss_dr' == this.gameType || 'sss_zz' == this.gameType){
            //     if(toggleIndex == 0){
            //         this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
            //         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            //     }
            //     else if(toggleIndex == 1){
            //         this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
            //         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            //     }
            // }
        }
        else if("taishusuanfa" == key){
            if(toggleIndex == 2 && !needClearList[toggleIndex].getChildByName('checkmark').active){
                this.Toggles['kexuanwanfa'][6].active = true;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][6].parent);
            }else{
                this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active = false;
                this.Toggles['kexuanwanfa'][6].active = false;
            }
        }
        else if ("suanfenfangsi" == key) {
            this.zpmjToggleIndex = toggleIndex;
            if (this.zpmjToggleIndex == 0) {//选择算台制后，下方涨分设置和抓花不可见或不可选
                this.Toggles['zhangfenshezhi'][0].parent.active = false;
                this.Toggles['zhuahua'][0].parent.active = false;
                this.Toggles['angangfenshu'][0].parent.active = true;
            }else{
                this.Toggles['zhangfenshezhi'][0].parent.active = true;
                this.Toggles['zhuahua'][0].parent.active = true;
                this.Toggles['angangfenshu'][0].parent.active = false;
            }
        }
        if(toggles.getComponent(cc.Toggle)){//复选框
            needShowIndexList = [];
            for(let i=0;i<needClearList.length;i++){
                let mark = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if(mark && i != toggleIndex){
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if(!mark && i == toggleIndex){
                    needShowIndexList.push(i);
                }
            }
        }
        this.ClearToggleCheck(needClearList,needShowIndexList);
        this.UpdateLabelColor(toggles,'fangfei' == key ? true : false);
    },
});

module.exports = fzmjChildCreateRoom;