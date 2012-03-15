var winFollowing2=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:false,
		fullscreen:false
	});
	var homeButton = Ti.UI.createButton({
		backgroundImage:'images/back.png',
		width:67,
		height:28
	});
	self.leftNavButton = homeButton;
	homeButton.addEventListener("click",function(e){
		var winFollowing = require("ui/winFollowing");
		var w = new winFollowing();
		//w.open({model:true});
		self.tab.open(w);
	})
	var tableView = Ti.UI.createTableView({		
	})
	self.add(tableView);
	var pageIndex=0;
	var pageCount=10;
	
	var processData = function(datas,isGet){
		for(var i=0;i<datas.length;i++){
			var f = datas[i];
			//Ti.API.log(f);
			var row = Ti.UI.createTableViewRow({height:200});
			
			var UserPinsView = require("publicUI/UserPinsView");
			var pview = new UserPinsView(f);
			
			row.add(pview);
			tableView.appendRow(row);
			
			
		}	
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
		if (pageIndex<=pageCount){
			isLoading = true;
			var categoryService = require("services/CategoryService");
			categoryService.getFollowings(pageIndex*20+1,processData);
		}
	}
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

	tableView.addEventListener('scroll', function(e) {
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
		if (!settings.showAnimation){
			return;
		}
		//Ti.API.info('distance='+distance+"     lastDistance="+lastDistance+" offset.y="+e.contentOffset.y);
		if (distance<lastDistance){
			isGoDown = true;
		}else{
			isGoDown = false;
		}
		if (e.contentOffset.y<100){
			isGoDown = false;
		}
		if (!isGoDown){
			if (lastDistance<=0){
				isGoDown = true;
			}
		}
		//Ti.API.info(isGoDown?"down":"up");
		if (isGoDown){
			self.hideNavBar();
			Ti.App.fireEvent("app:tabgroup",{visible:false});
		}else{
			self.showNavBar();
			Ti.App.fireEvent("app:tabgroup",{visible:true});
		}
		lastDistance = distance;
	});
	return self;
};
module.exports = winFollowing2;
