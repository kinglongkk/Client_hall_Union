/*
创建房间子界面
 */
var app = require("app");

var sjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
    	let sendPack = {};
		let yongpai=this.GetIdxByKey('yongpai');
		let fenshu=this.GetIdxByKey('fenshu');
		let fenzu=this.GetIdxByKey('fenzu');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');

    	sendPack = {
			"yongpai":yongpai,
			"fenshu":fenshu,
			"fenzu":fenzu,
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
            if('renshu' == key){
				if(toggleIndex == 0){
					if (!this.Toggles["yongpai"][2].getChildByName("checkmark").active) {
						this.Toggles["yongpai"][2].getChildByName("checkmark").active = true;
						this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
						this.Toggles["yongpai"][0].getChildByName("checkmark").active = false;
						let toggles = this.Toggles["yongpai"][0].parent;
						this.UpdateLabelColor(toggles);
						if(!this.Toggles["fenshu"][0].getChildByName("checkmark").active){
							this.Toggles["fenshu"][0].getChildByName("checkmark").active = true;
							this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
							this.Toggles["fenshu"][2].getChildByName("checkmark").active = false;
							let toggles = this.Toggles["fenshu"][0].parent;
							this.UpdateLabelColor(toggles);
						}
					}
					if (!this.Toggles["fenzu"][0].getChildByName("checkmark").active) {
						this.Toggles["fenzu"][2].getChildByName("checkmark").active = false;
						this.Toggles["fenzu"][1].getChildByName("checkmark").active = false;
						this.Toggles["fenzu"][0].getChildByName("checkmark").active = true;
						let toggles = this.Toggles["fenzu"][0].parent;
						this.UpdateLabelColor(toggles);
					}
				}
				else{
					if (this.Toggles["yongpai"][2].getChildByName("checkmark").active) {
						this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
						this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
						this.Toggles["yongpai"][0].getChildByName("checkmark").active = true;
						let toggles = this.Toggles["yongpai"][0].parent;
						this.UpdateLabelColor(toggles);
						if(this.Toggles["fenshu"][0].getChildByName("checkmark").active){
							this.Toggles["fenshu"][0].getChildByName("checkmark").active = false;
							this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
							this.Toggles["fenshu"][2].getChildByName("checkmark").active = true;
							let toggles = this.Toggles["fenshu"][0].parent;
							this.UpdateLabelColor(toggles);
						}
					}
				}
			}
			this.UpdateOnClickToggle();
            return;
        } //用牌数量
		else if ('yongpai' == key) {
			//如果点了一副牌
			if(toggleIndex == 2){
				//如果人数为4人
				if(this.Toggles["renshu"][1].getChildByName("checkmark").active){
					this.Toggles["renshu"][0].getChildByName("checkmark").active = true;
					this.Toggles["renshu"][1].getChildByName("checkmark").active = false;
					let toggles = this.Toggles["renshu"][0].parent;
					this.UpdateLabelColor(toggles);
					if(!this.Toggles["fenzu"][0].getChildByName("checkmark").active){
						this.Toggles["fenzu"][0].getChildByName("checkmark").active = true;
						this.Toggles["fenzu"][1].getChildByName("checkmark").active = false;
						this.Toggles["fenzu"][2].getChildByName("checkmark").active = false;
						let toggles = this.Toggles["fenzu"][0].parent;
						this.UpdateLabelColor(toggles);
					}
				}
				//如果分数不为400分
				if(!this.Toggles["fenshu"][0].getChildByName("checkmark").active){
					this.Toggles["fenshu"][0].getChildByName("checkmark").active = true;
					this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
					this.Toggles["fenshu"][2].getChildByName("checkmark").active = false;
					let toggles = this.Toggles["fenshu"][0].parent;
					this.UpdateLabelColor(toggles);
				}
			}else{
				if(this.Toggles["renshu"][0].getChildByName("checkmark").active){
					this.Toggles["renshu"][0].getChildByName("checkmark").active = false;
					this.Toggles["renshu"][1].getChildByName("checkmark").active = true;
					let toggles = this.Toggles["renshu"][0].parent;
					this.UpdateLabelColor(toggles);
				}
				//如果点了两副牌
				if(toggleIndex == 1){
					//如果分数不为400分
					if(!this.Toggles["fenshu"][0].getChildByName("checkmark").active){
						this.Toggles["fenshu"][0].getChildByName("checkmark").active = true;
						this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
						this.Toggles["fenshu"][2].getChildByName("checkmark").active = false;
						let toggles = this.Toggles["fenshu"][0].parent;
						this.UpdateLabelColor(toggles);
					}
				}else{
					//如果分数不为400分
					if(this.Toggles["fenshu"][0].getChildByName("checkmark").active){
						this.Toggles["fenshu"][0].getChildByName("checkmark").active = false;
						this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
						this.Toggles["fenshu"][2].getChildByName("checkmark").active = true;
						let toggles = this.Toggles["fenshu"][0].parent;
						this.UpdateLabelColor(toggles);
					}
				}
			}
		}
		else if ('fenshu' == key) {
			if(toggleIndex == 0){
				if(this.Toggles["yongpai"][0].getChildByName("checkmark").active){
					this.Toggles["yongpai"][0].getChildByName("checkmark").active = false;
					this.Toggles["yongpai"][1].getChildByName("checkmark").active = true;
					this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
					let toggles = this.Toggles["yongpai"][0].parent;
					this.UpdateLabelColor(toggles);
				}
			}else{
				if(!this.Toggles["yongpai"][0].getChildByName("checkmark").active){
					this.Toggles["yongpai"][0].getChildByName("checkmark").active = true;
					this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
					this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
					let toggles = this.Toggles["yongpai"][0].parent;
					this.UpdateLabelColor(toggles);
				}
			}
		}
		else if ('fenzu' == key) {
			if(toggleIndex > 0){
				if(this.Toggles["renshu"][0].getChildByName("checkmark").active){
					this.Toggles["renshu"][0].getChildByName("checkmark").active = false;
					this.Toggles["renshu"][1].getChildByName("checkmark").active = true;
					let toggles = this.Toggles["renshu"][0].parent;
					this.UpdateLabelColor(toggles);
					if(this.Toggles["yongpai"][2].getChildByName("checkmark").active){
						this.Toggles["yongpai"][0].getChildByName("checkmark").active = true;
						this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
						this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
						let toggles = this.Toggles["yongpai"][0].parent;
						this.UpdateLabelColor(toggles);
						if(this.Toggles["fenshu"][0].getChildByName("checkmark").active){
							this.Toggles["fenshu"][0].getChildByName("checkmark").active = false;
							this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
							this.Toggles["fenshu"][2].getChildByName("checkmark").active = true;
							let toggles = this.Toggles["fenshu"][0].parent;
							this.UpdateLabelColor(toggles);
						}
					}
				}
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
    UpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
        this.OnUpdateTogglesLabel(TogglesNode, isResetPos);
        let curKey = TogglesNode.name.substring(('Toggles_').length, TogglesNode.name.length);
        let reg = /\/s/g;
        for (let key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                if (curKey == this.gameCreateConfig[key].Key) {
                    let AAfangfeiDatas = [];
                    let WinfangfeiDatas = [];
                    let FangZhufangfeiDatas = [];
                    let clubGuanLiFangFeiDatas = [];
                    let clubWinFangFeiDatas = [];
                    let clubAAFangFeiDatas = [];
                    let unionGuanliFangFeiDatas = [];
                    let title = this.gameCreateConfig[key].Title.replace(reg, ' ');
                    TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
                    let descList = [];
                    if ('jushu' != curKey) {//局数读roomcost
                        descList = this.gameCreateConfig[key].ToggleDesc.split(',');
                        if (this.clubData && 'fangfei' == curKey) {
                            descList = ['管理付'];
                        } else if (this.unionData && 'fangfei' == curKey) {
                            descList = ['盟主付'];
                        }
                        if (descList.length != TogglesNode.children.length - 2) {//减去标题和帮助按钮
                            this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
                            break;
                        }
                    }
                    let jushuIndex = -1;
                    let renshuIndex = -1;
                    let renshu = [];//0表示读房主支付配置
                    if ('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey) {

                        let publicCosts = this.getCostData(renshu);

                        if (this.Toggles['renshu'])
                            renshu = this.getCurSelectRenShu();

                        let SpiltCosts = this.getCostData(renshu);
                        let curCostData = null;
                        if (0 == renshu.length) {
                            curCostData = publicCosts;
                        }
                        else {
                            curCostData = SpiltCosts;
                        }
                        if (this.Toggles['jushu']) {
                            jushuIndex = 0;
                            for (let i = 0; i < this.Toggles['jushu'].length; i++) {
                                let mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
                                if (mark) {
                                    jushuIndex = i;
                                    break;
                                }
                                jushuIndex++;
                            }
                            for (let i = 0; i < curCostData.length; i++) {
                            	if (curCostData[i].SetCount == 501) {
									this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount % 500 + '档';
									continue;
								}
                                this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount + '局';
                            }
                        }
                        if (this.Toggles['fangfei'] && -1 != jushuIndex) {
                            if (jushuIndex < publicCosts.length) {
                                AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

                                clubGuanLiFangFeiDatas.push(publicCosts[jushuIndex].ClubCostCount);
                                clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
                                clubAAFangFeiDatas.push(publicCosts[jushuIndex].ClubAaCostCount);
                                //赛事房费
                                unionGuanliFangFeiDatas.push(publicCosts[jushuIndex].UnionCostCount);
                            }
                            if (jushuIndex < SpiltCosts.length) {
                                AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

                                clubGuanLiFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCostCount);
                                clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
                                clubAAFangFeiDatas.push(SpiltCosts[jushuIndex].ClubAaCostCount);
                                //赛事房费
                                unionGuanliFangFeiDatas.push(SpiltCosts[jushuIndex].UnionCostCount);
                            }
                        }
                    }
                    if ('jushu' != curKey) {
                        let descInde = 0;
                        for (let i = 0; i < TogglesNode.children.length; i++) {
                            if (TogglesNode.children[i].name.startsWith('Toggle')) {
                                TogglesNode.children[i].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
                                descInde++;
                            }
                        }
                    }

                    if (0 != AAfangfeiDatas.length) {
                        let needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
                        let ffNodes = this.Toggles['fangfei'];
                        let hasHideNode = false;
                        let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                        for (let s = 0; s < ffNodes.length; s++) {
                            let needNode = ffNodes[s].getChildByName('fangfeiNode');
                            needNode.active = true;
                            if (hasHideNode && !needNode.parent.isFirstNode && isResetPos) {
                                needNode.parent.x = needNode.parent.x - spacing[s] - 80;
                                hasHideNode = false;
                            }
                            //如果房费配的是0，则隐藏
                            if (needCount <= 0 && 1 == s) {
                                needNode.parent.active = false;
                                hasHideNode = true;
                                continue;
                            }
                            let disCost = -1;
                            if (this.clubData == null && this.unionData == null) {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                                else if (1 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * AAfangfeiDatas[AAfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                                else {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * WinfangfeiDatas[WinfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                            } else if (this.clubData == null && this.unionData != null) {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                            } else {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                                // else if(1==s){
                                //     needNode.getChildByName('icon').active=false;
                                //     needNode.getChildByName('icon_qk').active=true;
                                //     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
                                //     needNode.getChildByName('needNum').clubWinnerPayConsume = clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
                                //     ffNodes[s].getChildByName('editbox').active=false;
                                // }else{
                                //     needNode.getChildByName('icon').active=false;
                                //     needNode.getChildByName('icon_qk').active=true;
                                //     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
                                //     needNode.getChildByName('needNum').clubWinnerPayConsume = clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
                                //     ffNodes[s].getChildByName('editbox').active=false;
                                // }
                            }
                        }
                    }
                }
            }
        }
        if (this.Toggles["gaoji"]) {
            for (let i = 0; i < this.Toggles["gaoji"].length; i++) {
                let ToggleDesc = this.Toggles["gaoji"][i].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "30秒未准备自动踢出房间") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["gaoji"][i].active = false;
                        this.Toggles["gaoji"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["gaoji"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        } else if (this.Toggles["kexuanwanfa"]) {
            for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
                let ToggleDesc = this.Toggles["kexuanwanfa"][i].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "比赛分不能低于0") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["kexuanwanfa"][i].active = false;
                        this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["kexuanwanfa"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        }
    },
});

module.exports = sjChildCreateRoom;