/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let moShi = this.GetIdxByKey('moShi');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let moban = this.GetIdxByKey("moban");
        let gaoji=[];
        for(let i=0;i<this.Toggles['gaoji'].length;i++){
            if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                gaoji.push(i);
            }
        }
        let kexuanwanfa = [];
        for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
         if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
             kexuanwanfa.push(i);
         }
        }
        sendPack = {
                    "moShi":moShi,
                    "xianShi":xianShi,
                    "jiesan":jiesan,
                    "moban":moban,
                    "playerMinNum":renshu[0],
                    "playerNum":renshu[1],
                    "setCount":setCount,
                    "paymentRoomCardType":isSpiltRoomCard,
                    "kexuanwanfa":kexuanwanfa,
                    "gaoji":gaoji,
        };
        return sendPack;
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
            // if(this.Toggles['zhuaniao'][0].getChildByName('checkmark').active==true && toggleIndex==4){
            //     //红中赖子
            //     app.SysNotifyManager().ShowSysMsg("按庄家中鸟不能勾选红中癞子玩法");
            //     return;
            // }
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