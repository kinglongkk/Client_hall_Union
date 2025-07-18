/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),
	// extends: require("BaseForm"),

	properties: {
		// NodeHuType: cc.Node,
		// max_cardPrefab: cc.Prefab,
		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame,
		// kongge: cc.Node,
	},


	// use this for initialization
	OnLoad: function () {
		this.PokerCard = app.PokerCard();
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.showGangNum = 1;
		app.Client.RegEvent("xlbbp_ChangeSelectState", this.Event_ChangeSelectState, this);
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		let posResultList = setEnd["posResultList"];
		this.posResultInfo = posResultList[index];
		console.log("setEnd", setEnd);
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = setEnd.dPos;
		let posHuArray = new Array();
		let posCount = posResultList.length;
		for (let i = 0; i < posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		let PlayerInfo = playerAll[index];
		PlayerInfo["xiaoJiaFlag"] = posResultList[index]["xiaoJiaFlag"];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.maPaiLst);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo) {
		// this.jiesuan = this.GetWndNode("layoutall/layoutlist/jiesuan");
		// this.hutypelayout = this.GetWndNode("layoutall/layoutlist/hutypelayout");
		// this.node.getChildByName("showcard").removeAllChildren();
		// this.hutypelayout.removeAllChildren();
		this.ShowPlayerRecord(PlayerNode, HuList);
		// this.ShowPlayerHuType(HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName("user_info"), PlayerInfo);
		// this.ShowPlayerCPGCard(PlayerNode.getChildByName("showcard"), HuList["publicCardList"]);
		// this.ShowPlayerShowCard(PlayerNode.getChildByName("showcard"), HuList["shouCard"]);
		// this.ShowPlayerHuCard(PlayerNode.getChildByName("showcard"), HuList["handCard"]);
		// this.ShowPlayerHuCard(PlayerNode.getChildByName("showcard"), HuList["huCard"]);
		// this.ShowPlayerJieSuan(HuList);
		// this.ShowBaiPaiList(PlayerNode, HuList["baiPaiList"]);
		// this.ShowHuType(PlayerNode, HuList["huType"]);
		// this.ShowFanShu(PlayerNode, HuList["fanShu"]);
	},

	SetSelectState: function (isSelect) {
		if (this.isSelect == isSelect) {
			return;
		}

		this.isSelect = isSelect;
		this.node.getChildByName("img_select").active = this.isSelect;
		this.node.getChildByName("img_nonSelect").active = !this.isSelect;

		// let color = this.isSelect ? new cc.Color().fromHEX("#893700") : new cc.Color().fromHEX("#05356c");
		// this.node.getChildByName('lb_name').color = color;
		// this.node.getChildByName('tip_sportsPoint').getChildByName('lb_lostPoint').color = color;
		// this.node.getChildByName('tip_sportsPoint').getChildByName('lb_winPoint').color = color;
	},

	onDestroy: function () {
		app.Client.UnRegTargetEvent(this);
	},

	Event_ChangeSelectState: function (targetPos) {
		this.SetSelectState(targetPos == this.posResultInfo.pos);
	},

	//控件点击回调
	OnClick_BtnWnd: function OnClick_BtnWnd(eventTouch, eventData) {
		try {
			app.SoundManager().PlaySound("BtnClick");
			var btnNode = eventTouch.currentTarget;
			var btnName = btnNode.name;
			this.OnClick(btnName, btnNode);
		} catch (error) {
			                console.error("OnClick_BtnWnd:%s", error.stack);
		}
	},

	OnClick: function (btnName, btnNode) {
		app.Client.OnEvent("xlbbp_ChangeSelectState", this.posResultInfo.pos);
	},

	// ShowBaiPaiList: function (playerNode, baiPaiList) {
	// 	let baiPaiNodeList = playerNode.getChildByName("baiPaiList");
	// 	let baiPaiItem = playerNode.getChildByName("baiPaiItem");
	// 	baiPaiNodeList.removeAllChildren();

	// 	for (let i = 0; i < baiPaiList.length; i++) {
	// 		let cardId = baiPaiList[i];
	// 		let node = cc.instantiate(baiPaiItem);
	// 		baiPaiNodeList.addChild(node);
	// 		node.active = true;
	// 		node.cardId = cardId;
	// 		this.GetSelfPokeCard(cardId, node);
	// 	}
	// 	playerNode.getChildByName("lb_baiPaiCount").getComponent(cc.Label).string = "摆牌：" + baiPaiList.length + "张"
	// },

	GetSelfPokeCard: function (poker, cardNode, isHu = false) {
		if (0 == poker) {
			return;
		}
		cardNode.active = true;
		let type = Math.floor(poker / 100);
		let iconSp = cardNode.getComponent(cc.Sprite);
		// iconSp.spriteFrame = this.selfPokerDict[type];

		cc.loader.loadRes("ui/uiGame/cp/self/" + type, cc.SpriteFrame, function (err, spriteFrame) {
			if (err) {
				cc.error(err);
				return;
			}
			iconSp.spriteFrame = spriteFrame;
		});
	},

	ShowHuType: function (playerNode, huType) {
		playerNode.getChildByName("img_hu").active = huType == "ZiMo";
	},

	ShowFanShu: function (playerNode, fanShu) {
		playerNode.getChildByName("lb_fanShu").getComponent(cc.Label).string = fanShu + "番";
	},

	ShowPlayerRecord: function (ShowNode, huInfo) {

		ShowNode.getChildByName("lb_posOrder").getComponent(cc.Label).string = huInfo.pos + 1;

		// let fanNum = huInfo["fanNum"];
		// ShowNode.getChildByName("record").getComponent("cc.Label").string = fanNum + "番";
		let point = ShowNode.getChildByName("point");
		point.active = true;
		if (huInfo["point"] > 0) {
			point.getComponent("cc.Label").string = "+" + huInfo["point"];
		} else {
			point.getComponent("cc.Label").string = huInfo["point"];
		}
		// let hudian = ShowNode.getChildByName("hudian");
		// hudian.active = true;
		// if (huInfo["huDian"] > 0) {
		// 	hudian.getComponent("cc.Label").string = "+" + huInfo["huDian"] + "点";
		// } else {
		// 	hudian.getComponent("cc.Label").string = huInfo["huDian"] + "点";
		// }
		let roompoint = ShowNode.getChildByName("roompoint");
		roompoint.active = true;
		if (huInfo["roomPoint"] > 0) {
			roompoint.getComponent("cc.Label").string = "总分：+" + huInfo["roomPoint"];
		} else {
			roompoint.getComponent("cc.Label").string = "总分：" + huInfo["roomPoint"];
		}
		//显示竞技点
		if (typeof (huInfo["sportsPoint"]) != "undefined") {
			if (huInfo["sportsPoint"] > 0) {
				this.node.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：+" + huInfo["sportsPoint"];
			} else {
				this.node.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：" + huInfo["sportsPoint"];
			}
			this.node.getChildByName("lb_SportsPoint").active = true;
		} else {
			this.node.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "";
			this.node.getChildByName("lb_SportsPoint").active = false;
		}
	},
	ShowPlayerInfo: function (ShowNode, PlayerInfo) {
		ShowNode.getChildByName("lable_name").getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName("label_id").getComponent("cc.Label").string = this.ComTool.GetPid(PlayerInfo["pid"]);
		ShowNode.getChildByName("img_xiao").active = PlayerInfo["xiaoJiaFlag"];
		/*if (PlayerInfo["piaoHua"] == 1) {
			ShowNode.getChildByName("btn_p").active = true;
			ShowNode.getChildByName("btn_bp").active = false;
		} else if (PlayerInfo["piaoHua"] == 0) {
			ShowNode.getChildByName("btn_p").active = false;
			ShowNode.getChildByName("btn_bp").active = true;
		} else if (PlayerInfo["piaoHua"] == -1) {
			ShowNode.getChildByName("btn_p").active = false;
			ShowNode.getChildByName("btn_bp").active = false;
		}*/
		ShowNode.getChildByName("btn_p").active = false;
		ShowNode.getChildByName("btn_bp").active = false;
		if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Boy) {
			ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteMale;
		} else if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Girl) {
			ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteFeMale;
		}
	},
	ShowPlayerJieSuan: function (huInfoAll) {
		for (let i = 0; i < this.jiesuan.children.length; i++) {
			this.jiesuan.children[i].active = false;
		}
		let huType = huInfoAll["huType"];
		if ("QGH" == huType) {
			huType = "JiePao"
		}
		if (huType != "NotHu") {
			this.jiesuan.getChildByName(huType).active = true;
		}
		if (huType == "PingHu") {
			this.jiesuan.getChildByName("Hu").active = false;
		}
	},
	ShowPlayerHuType: function (huInfoAll) {
		let huTypeMap = huInfoAll["endPoint"]["huTypeMap"];
		let huTypeMapStr = {
			ErShiSiTuoHong: "龙胡",
			ShiTuoHong: "十坨红",
			TuoTuoHong: "坨坨红",
			TuoTuoHei: "坨坨黑",
			HeiLong: "黑龙",
			TianHu: "天胡",
			XiaoHu: "小胡",
			SiZhang: "四张",
			ChongTianFan: "冲番牌",
			BaoJiao: "报叫",
			ChiPiao: "吃飘",
		};
		for (let key in huTypeMap) {
			let huNode = cc.instantiate(this.NodeHuType);
			let huTypeStr = huTypeMapStr[key];
			let huTypePoint = huTypeMap[key];
			if (key == "XiaoHu" || key == "ChiPiao") {
				huTypePoint = "";
			}
			huNode.getComponent(cc.Label).string = huTypeStr + huTypePoint;
			this.hutypelayout.addChild(huNode);
		}
	},
	ShowPlayerShowCard: function (ShowNode, cardIDList) {
		let shouCard = this.SortShouCard(cardIDList);
		let cardListNode = ShowNode;
		for (let i = 0; i < shouCard.length; i++) {
			for (let j = 0; j < shouCard[i].length; j++) {
				let cardValue = shouCard[i][j];
				let cardNode = cc.instantiate(this.max_cardPrefab);
				this.ShowCard(cardValue, cardNode);
				cardListNode.addChild(cardNode);
			}
			let kongge = cc.instantiate(this.kongge);
			cardListNode.addChild(kongge);
		}
	},
	ShowPlayerCPGCard: function (ShowNode, cardIDList) {
		let cardListNode = ShowNode;
		cardListNode.removeAllChildren();
		for (let i = 0; i < cardIDList.length; i++) {//[[1,2],[4,5]]
			let cardArr = cardIDList[i];
			let cardList = cardArr.slice(3, cardArr.length);
			for (let j = 0; j < cardList.length; j++) {
				let cardNode = cc.instantiate(this.max_cardPrefab);
				let cardValue = cardList[j];
				this.ShowCard(cardValue, cardNode);
				cardListNode.addChild(cardNode);
			}
			let kongge = cc.instantiate(this.kongge);
			cardListNode.addChild(kongge);
		}
	},
	ShowPlayerHuCard: function (ShowNode, handCard) {
		if (handCard == 0) {
			return;
		}
		let cardListNode = ShowNode;
		let cardNode = cc.instantiate(this.max_cardPrefab);
		this.ShowCard(handCard, cardNode, true);
		cardListNode.addChild(cardNode);
		this.jiesuan.getChildByName("Hu").active = true;
	},
	//显示poker牌
	ShowCard: function (cardType, cardNode, isHu = false) {
		this.GetPokeCard(cardType, cardNode, isHu);
		cardNode.active = true;
		cardNode.getChildByName("poker_back").active = false;
	},
	GetPokeCard: function (poker, cardNode, isHu = false) {
		if (0 == poker) {
			return;
		}
		let type1 = Math.floor(poker / 100);
		let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		cardNode.getChildByName("img_hupai").active = isHu;
		iconSp.spriteFrame = this.PokerCard.aycp_pokerDict[type1];
	},
	//获取牌值
	GetCardValue: function (poker) {
		poker = Math.floor(poker / 100);
		return poker & this.LOGIC_MASK_VALUE;
	},
	GetWndNode: function (wndPath) {
		let wndNode = cc.find(wndPath, this.node);
		if (!wndNode) {
			                console.error("GetWndNode(%s) not find", wndPath);
			return;
		}
		return wndNode;
	},
	SortShouCard: function (shouCard) {
		if (shouCard[0] == 0) {
			console.error("没有手牌", shouCard);
			return;
		}
		//4行7竖
		//第一排从小到大排序
		//第二排可以凑14点的开始排，多出4行另取一竖，往后继续叠加
		//找出相同的牌值为1组
		let pokers = this.GetMonyPais(shouCard);
		for (let i = 0; i < pokers.length; i++) {
			pokers[i].sort((a, b) => {
				return this.GetCardValue(a) - this.GetCardValue(b);
			});
		}

		let allResults = [];
		let useDanPai = [];
		//1、单张和多组牌组成14张
		//多张和多组牌组成14张  4张和4张

		for (let l = 0; l < pokers.length; l++) {
			for (let i = l + 1; i < pokers.length; i++) {
				let value = this.GetCardValue(pokers[l][0]);
				let target = this.GetCardValue(pokers[i][0]);
				if (value + target == 14) {
					if (useDanPai.indexOf(pokers[l][0]) > -1 || useDanPai.indexOf(pokers[i][0]) > -1) {
						console.error("已经在使用过的数组中了");
						continue;
					}
					allResults.push(pokers[l].concat(pokers[i]));
					useDanPai = [].concat(useDanPai, pokers[l], pokers[i]);
				}
			}
		}
		//没有用过剩余的牌从小到大排序
		for (let i = 0; i < pokers.length; i++) {
			for (let j = 0; j < pokers[i].length; j++) {
				if (useDanPai.indexOf(pokers[i][j]) < 0) {
					allResults.push(pokers[i]);
					break;
				}
			}
		}
		allResults.sort((a, b) => {
			return this.GetCardValue(a[0]) - this.GetCardValue(b[0]);
		});
		//将超过4张的那组牌进行分离
		let cAllResults = [];
		for (let i = 0; i < allResults.length; i++) {
			let cards = allResults[i];
			if (cards.length <= 4) {
				cAllResults.push(allResults[i]);
			} else {// > 4
				let chai = [];
				let chai1 = [];
				let chai2 = [];
				for (let i = 0; i < cards.length; i++) {
					if (i < 4) {
						chai1.push(cards[i]);
					} else {
						chai2.push(cards[i]);
					}
				}
				chai.push(chai1, chai2);
				chai.sort((a, b) => {
					return this.GetCardValue(a[0]) - this.GetCardValue(b[0]);
				});
				for (let j = 0; j < chai.length; j++) {
					cAllResults.push(chai[j]);
				}
			}
		}
		console.log("3整理后的手牌", cAllResults, allResults, useDanPai);
		return cAllResults;
	},
	GetMonyPais: function (shouCard) {
		let cards = [];
		for (let i = 0; i < shouCard.length; i++) {
			let poker = shouCard[i];
			let pokers = this.GetSameValue(shouCard, poker);
			let bInList4 = this.CheckPokerInListEx(cards, poker);
			if (!bInList4) {
				this.PushTipCard(cards, pokers, pokers.length);
			}
		}
		console.log("获取相同的牌值的数组", cards);
		return cards;
	},
	//获取同一牌值
	GetSameValue: function (pokers, tagCard) {
		let sameValueList = [];
		let tagCardValue = this.GetCardValue(tagCard);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let pokerValue = this.GetCardValue(poker);

			if (tagCardValue == pokerValue) {
				sameValueList[sameValueList.length] = poker;
			}
		}
		return sameValueList
	},
	CheckPokerInListEx: function (list, tagCard) {
		if (list.length == 0) {
			return false;
		}
		let bInList = false;
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			let cardValue = this.GetCardValue(item[0]);
			let tagValue = this.GetCardValue(tagCard);

			if (cardValue == tagValue) {
				bInList = true;
			}
		}
		return bInList;
	},
	PushTipCard: function (pokers, samePoker, len) {
		let temp = [];
		samePoker.reverse();
		for (let i = 0; i < len; i++) {
			temp.push(samePoker[i]);
		}
		pokers.push(temp);
	},
});