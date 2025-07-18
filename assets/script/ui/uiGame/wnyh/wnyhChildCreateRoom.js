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
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let fengDing = this.GetIdxByKey('fengDing');
        let weizi = this.GetIdxByKey('weizi');
        let wanfa = this.GetIdxByKey("wanfa");
        let fangjian=[];
        let gaoji=[];
        for(let i=0;i<this.Toggles['fangjian'].length;i++){
            if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
                fangjian.push(i);
            }
        }
        for(let i=0;i<this.Toggles['gaoji'].length;i++){
            if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                gaoji.push(i);
            }
        }
        sendPack = {
                "weizi":weizi,
                "xianShi":xianShi,
                "jiesan":jiesan,
                "fengDing":fengDing,
                "playerMinNum":renshu[0],
                "playerNum":renshu[1],
                "setCount":setCount,
                "paymentRoomCardType":isSpiltRoomCard,
                "fangjian":fangjian,
                "gaoji":gaoji,
                "wanfa":wanfa,
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
        }
        // else if('kexuanwanfa' == key){
        //     if(toggleIndex <2){
        //        this.ClearToggleCheck(this.Toggles['fengding'],[1]);
        //        this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
        //     }
        // }else if('fengding' == key){
        //     if(toggleIndex==0){
        //        if(this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active ==false){
        //             this.ShowSysMsg('梓埠清混才能选择封顶');
        //             return;
        //        }
        //     }
        // }
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