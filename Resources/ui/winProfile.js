var winProfile=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		navBarHidden:false,
		tabBarHidden:true,
		fullscreen:false
	});
	Ti.App.fireEvent("app:tabgroup",{visible:true});
	var buttonLeft = Ti.UI.createButton({
		backgroundImage:'images/account.png',
		width: 74,
		height: 28
	});
	self.leftNavButton = buttonLeft;
	buttonLeft.addEventListener("click",function(e){
		
		var logoutOption = Ti.UI.createOptionDialog({
			options : [LL('global.banner.me.logout'), LL('app.cancel')],
			cancel : 1,
			destructive:1
		});
		logoutOption.show();
		logoutOption.addEventListener("click", function(e) {
			if (e.index==0){
				//logout;
				var userService = require("/services/UserService");
				userService.logout();
				hasDone=false;
				isLogin = false;
			}
		});

	});
	var tableView=Ti.UI.createTableView({
		top:0,
		height:1000
	});
	var row=Ti.UI.createTableViewRow({height:'auto'});
	tableView.data=[row];
	tableView.selectionStyle=Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	self.add(tableView);
	var isRefresh=false;
	/***********pull refresh component*******************/
	var tableHeader=require('publicUI/TableViewPullRefresh');
	new tableHeader(tableView,function(e){
		page = 0;
		isRefresh=true; //flag
		tableView.deleteRow(0);
		tableView.data =[];
		//add the scrollview to tableview first row 2012.3.30
		//tableView.height = maxHeight;
		row = Ti.UI.createTableViewRow({
			height : 'auto'
		});
		tableView.data = [row];
		self.loadData();
	});

	
	var isLogin = true;
	var hasDone = false;
	var userView=null;
	self.loadData=function(){
		
		var createProfileView = function(u) {
			/*if((self.children) && (self.children.length > 0)) {
				self.remove(self.children[0]);
			}*/
			tableView.deleteRow(0);
			tableView.data=[];	
			row=Ti.UI.createTableViewRow({height:'auto'});
			
			var UserProfileView = require("publicUI/UserProfileView");
			userView = new UserProfileView(u, "tabProfile");
			//row.height = userView.height;
			row.add(userView); //add profileview to first row
			tableView.data=[row,Ti.UI.createTableViewRow({height:200})];
			
			hasDone = true;
		}//end function
		
		
		//hasDone=false;
		if(!hasDone || isRefresh) {
			//load data
			var userService = require("services/UserService");
			var user = userService.user();
			if((user) && (user.id)) {
				userService.getProfile(user.id, createProfileView);
			}

		}//end if

	}
	
	
	/*
	var buttonRight = Ti.UI.createButton({
		backgroundImage:'images/edit.png',
		width: 59,
		height: 28
	});
	self.rightNavButton = buttonRight;
	buttonRight.addEventListener("click",function(e){
		
		Ti.App.fireEvent("app:openWindow",{tab:"winProfile",url:"editProfile"});
	});
	*/		
	Ti.App.addEventListener("app:loginSuccess",function(e){
		isLogin=true;
	});
	
	//when page focus fireEvent
	self.addEventListener("focus",function(e){
		if (isLogin==false){
			return;
		}
		self.loadData();
		Ti.App.fireEvent("app:tabgroup",{visible:true});
	});

	return self;
};
module.exports = winProfile;
