/*
创建房间子界面
 */
var app = require("app");

var rcwskChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
        let fenzu = this.GetIdxByKey('fenzu');
        let moshi = this.GetIdxsByKey('moshi');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let jingongshunxu = this.GetIdxByKey('jingongshunxu');
        let jingong = this.GetIdxByKey('jingong');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "fenzu": fenzu,
            "moshi": moshi,
            "kexuanwanfa": kexuanwanfa,
            "jingongshunxu": jingongshunxu,
            "jingong": jingong,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
	},
	OnToggleClick: function (event) {
        this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
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
            this.UpdateTogglesLabel(toggles);
            this.UpdateOnClickToggle();
            return;
        }
        else if ("fangjian" == key) {
            // 小局托管解散,解散次数不超过5次,
            // 托管2小局解散,解散次数不超过3次",
            if (this.Toggles['fangjian'][1].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['fangjian'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
            } else if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 1) {
                this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            }
        }
        else {

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
        if(this.Toggles["moshi"]){
            this.UpdateLabelColor(this.Toggles['moshi'][0].parent);
            if(this.Toggles["fenzu"][0].getChildByName("checkmark").active){
                this.Toggles['moshi'][1].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['moshi'][1].getChildByName("label")){
                    this.Toggles['moshi'][1].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['moshi'][1].getChildByName("label")){
                    this.Toggles['moshi'][1].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
        }
    },
	
});

module.exports = rcwskChildCreateRoom;