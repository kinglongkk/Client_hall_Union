/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_jiesan:cc.Label,
        layout:cc.Node,
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------
    OnShow:function(clubId, unionId,type){
        this.clubId = clubId;
        this.unionId = unionId;
        this.lb_jiesan.string="";
        this.type=type;
        this.HunXiao();
        
    },
    HunXiao:function(){
        for(let i=0;i<this.layout.children.length;i++){
            this.layout.children[i].zIndex=Math.ceil(Math.random()*10);
        }
        this.layout.getComponent(cc.Layout).updateLayout();
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_xin'==btnName){
            this.lb_jiesan.string=this.lb_jiesan.string+"新";
        }else if('btn_hua'==btnName){
            this.lb_jiesan.string=this.lb_jiesan.string+"华";
        }else if('btn_qing'==btnName){
            this.lb_jiesan.string=this.lb_jiesan.string+"情";
        }else if('btn_huai'==btnName){
            this.lb_jiesan.string=this.lb_jiesan.string+"怀";
        }else if('btn_jie'==btnName){
            this.lb_jiesan.string=this.lb_jiesan.string+"解";
        }else if('btn_san'==btnName){
            this.lb_jiesan.string=this.lb_jiesan.string+"散";
        }else if('btn_jiesan'==btnName){
            if(this.lb_jiesan.string!="解散"){
                this.lb_jiesan.string="";
                app.SysNotifyManager().ShowSysMsg('请选择解散已确认本次操作');
                return;
            }
            if(this.type==1){
                //亲友圈
                app.ClubManager().SendCloseClub(this.clubId);
                this.FormManager.CloseFormReal('ui/club/UIClubMain');
            }
            if(this.type==2){
                //赛事
                let self=this;
                app.NetManager().SendPack("union.CUnionDissolve",{"clubId":this.clubId,"unionId":this.unionId}, function(serverPack){
                    app.FormManager().CloseForm("ui/club/UIUnionManager");
                    app.FormManager().CloseForm("ui/club_2/UIUnionManager_2");
                    // app.FormManager().CloseForm("ui/club/UIClubMain");
                    app.ClubManager().CloseClubFrom();
                    self.CloseForm();
                  }, function(){
                    app.SysNotifyManager().ShowSysMsg('赛事解散失败');
                });
            }
            this.CloseForm();
        }
        else{
			                console.error("OnClick:%s not find", btnName);
		}
	},
});
