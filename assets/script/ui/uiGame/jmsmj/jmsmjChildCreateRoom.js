/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let hupaiyaoqiu=this.GetIdxsByKey('hupaiyaoqiu');
        let fanbei=this.GetIdxsByKey('fanbei');
        let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');

        sendPack = {
            "hupaiyaoqiu":hupaiyaoqiu,
            "fanbei":fanbei,
            "kexuanwanfa":kexuanwanfa,
            "fangjian":fangjian,
            "xianShi":xianShi,
            "jiesan":jiesan,
            "gaoji":gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
    AdjustSendPack: function (sendPack) {
        return sendPack;
    },
    OnToggleClick: function (event) {
        this.FormManager.CloseForm("UIMessageTip");
        let toggles = event.target.parent;
        let toggle = event.target;
        let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
        let toggleIndex = parseInt(toggle.name.substring(('Toggle').length, toggle.name.length)) - 1;
        let needClearList = [];
        let needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            this.UpdateOnClickToggle();
            return;
        } else if ('kexuanwanfa' == key) {
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
        } else if('fangjian' == key){
            //每局先出黑桃3和首局先出黑桃3不能同时选择
            if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
                this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            } else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
            }

            if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
                this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
            } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
                this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
            }
        }
        if (toggles.getComponent(cc.Toggle)) {//复选框
            needShowIndexList = [];
            for (let i = 0; i < needClearList.length; i++) {
                let mark = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if (mark && i != toggleIndex) {
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if (!mark && i == toggleIndex) {
                    needShowIndexList.push(i);
                }
            }
        }
        this.ClearToggleCheck(needClearList, needShowIndexList);
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
        this.UpdateOnClickToggle();
    },
    UpdateOnClickToggle: function() {
        //选项置灰
        if(this.Toggles["fanbei"]){
            this.UpdateLabelColor(this.Toggles['fanbei'][0].parent);
            if(!this.Toggles["renshu"][0].getChildByName("checkmark").active){
                this.Toggles['fanbei'][0].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['fanbei'][0].getChildByName("label")){
                    this.Toggles['fanbei'][0].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['fanbei'][0].getChildByName("label")){
                    this.Toggles['fanbei'][0].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
        }
        if(this.Toggles["kexuanwanfa"]){
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            //仅4人场可选“跟庄”；
            if(!this.Toggles["renshu"][2].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][0].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][0].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][0].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][0].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][0].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
            //仅2人场可选“去掉万子”；
            if(!this.Toggles["renshu"][0].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][2].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][2].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
            //勾选“只能自摸”则 不能勾选“有漏胡”；
            if(this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][10].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][10].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][10].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][10].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][10].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
        }
    },
});

module.exports = fzmjChildCreateRoom;