var winActivity2=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:false,
		fullscreen:false
	});
	Ti.App.fireEvent("app:tabgroup",{visible:true});
	var tableView = Ti.UI.createTableView({
		data:["Loading..."],
		top:0
		//allowsSelection:false
	})
	self.add(tableView);
	
	var processData = function(datas){
		//Remove tableview scroll event when unloaded the data 
		tableView.removeEventListener('scroll',scrollProcess);
		var tbl_data= [];
		for(var i=0;i<datas.length;i++){
			var f = datas[i];
			var row = Ti.UI.createTableViewRow({height:'auto'});
			var UserPinsView = require("publicUI/UserActivityPinsView");
			var pview = new UserPinsView(f);
			row.add(pview);
			tbl_data.push(row);
		}
		tableView.data = tbl_data;
		isloading = true;
		tableView.addEventListener('scroll',scrollProcess);	
	};
	var isloading=false;
	
	self.addEventListener("focus",function(e){
		if (!isloading){
			var categoryService = require("services/CategoryService");
			categoryService.getActivityList(processData);			
		}		
		
	});	
	
	Ti.App.addEventListener("app:logout",function(e){
		tableView.data=[];
		isloading = false;
	});
	
	
	var lastDistance = 0;
	
	var isGoDown=false;
	var isShow = true;
	var scrollProcess=function(e) {
		return;
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;

		if(distance < lastDistance) {
			var nearEnd = theEnd * .75;
			/*
			if(!updating && (total >= nearEnd)) {
				beginUpdate();
			}
			*/
		}
		if (settings.showAnimation){
			
			Ti.API.info('distance='+distance+"     lastDistance="+lastDistance+" offset.y="+e.contentOffset.y);
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
				if (isShow==false){
					return;
				}
				self.hideNavBar();
				customTabGroup.hide();
				isShow = false;
			} else {
				if (isShow==true){
					return;
				}
				self.showNavBar();
				customTabGroup.show();
				isShow = true;
			}

		}
		
		lastDistance = distance;
	}
	
	//tableView.addEventListener('scroll', scrollProcess);
	/*
	var eView = Ti.UI.createView({
		top:0,
		left:0,
		width:self.width,
		height:self.height,
		transparent:true
	});
	self.add(eView);
	var yStart=0;
	var yEnd =0;
	eView.addEventListener("touchstart",function(e){
		Ti.API.info(e);
		yStart=e.y;
	});
	eView.addEventListener("touchend",function(e){
		yEnd = e.y;
		var newTop = tableView.top-(yEnd-yStart);
		tableView.scrollToTop(newTop);
	});
	*/
	return self;
};
module.exports = winActivity2;
