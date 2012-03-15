var winFollowing=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		fullscreen:false,
		navBarHidden:false
	});
	/*
	var BackNavButton = require("publicUI/BackNavButton");
	new BackNavButton(self);
	*/
	
	/*
	var followButton = Ti.UI.createButton({
		width:79,
		height:28,
		backgroundImage:'images/following.png'
	});
	self.leftNavButton = followButton;
	followButton.addEventListener("click",function(e){
		self.close();
	});
	*/
	
	
	var tableView = Ti.UI.createTableView({		
		//allowsSelection:false
	})
	self.add(tableView);
	
	var pageIndex=0;
	var pageCount=10;
	var rowindex=0;
	var processData = function(datas,isGet){		
		tableView.removeEventListener('scroll',scrollProcess);
		for(var i=0;i<datas.length;i++){
			var f = datas[i];
			//Ti.API.log(f);
			var row = Ti.UI.createTableViewRow({height:"auto"});
			var PicturePartView = require("ui/PicturePartView");
			var pview = new PicturePartView(f,f.photo,rowindex);
			row.add(pview);		
			tableView.appendRow(row);			
			rowindex++;
		}
		tableView.addEventListener('scroll',scrollProcess);
		/*		
		if (datas.length>0){
			updating = false;			
		}*/		
		if (isGet){
			pageIndex++;
		}
		updating = false;	
		isLoading = false;
	};
	function loadData(){
			
		var userService = require("services/UserService");
		if(!userService.isLogin()) {
			return;
		}

		if (pageIndex<=pageCount){
			isLoading = true;
			var categoryService = require("services/CategoryService");
			categoryService.getFollowingLatest(pageIndex*10+1,processData);	
		}
	}
	Ti.App.addEventListener("app:loginSuccess",function(e){
		pageIndex =0;
		loadData();
	});	
	
	Ti.App.addEventListener("app:deletePin",function(e){
		if (e.rowindex){
			tableview.deleterow(e.rowindex);
		}
	});
	var isFirstOpen=true;
	self.addEventListener("focus",function(e){
		if (isFirstOpen){
			loadData();
			isFirstOpen= false;
		}
		
	});
	Ti.App.addEventListener("app:logout",function(e){
		tableView.data=[];
		isFirstOpen = true;
	});
	var updating = false;	
	function beginUpdate() {
		updating = true;		
		//pageIndex++;
		loadData();
	}
	var lastDistance = 0;
	
	var isGoDown=false;
	var isShow = true;
	var scrollProcess= function(e) {
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;

		if(distance < lastDistance) {
			var nearEnd = theEnd * .75;
			if(!updating && (total >= nearEnd)) {
				beginUpdate();
			}
		}
		if (settings.showAnimation){
			
			//Ti.API.info('distance='+distance+"     lastDistance="+lastDistance+" offset.y="+e.contentOffset.y);
			if(distance < lastDistance) {
				isGoDown = true;
			} else {
				isGoDown = false;
			}
			if(e.contentOffset.y < 100) {
				isGoDown = false;
			}
			if(!isGoDown) {
				if(lastDistance <= 0) {
					isGoDown = true;
				}
			}
			//Ti.API.info(isGoDown?"down":"up");
			if(isGoDown) {
				if (isShow){
					/*						
					Ti.App.fireEvent("app:tabgroup", {
						visible : false
					});*/
					self.hideNavBar();
					customTabGroup.hide();
					isShow = false;
				}
				
				
			} else {
				if (!isShow){					
					/*
					Ti.App.fireEvent("app:tabgroup", {
						visible : true
					});
					*/
					self.showNavBar();
					customTabGroup.show();
					isShow = true;
	
				}
				
			}
	
		}
		
		lastDistance = distance;
	}
	tableView.addEventListener('scroll',scrollProcess);
	
	return self;
};
module.exports = winFollowing;
