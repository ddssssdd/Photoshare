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
		Ti.App.fireEvent("app:tabgroup",{visible:true});
	});	
	
	Ti.App.addEventListener("app:logout",function(e){
		tableView.data=[];
		isloading = false;
	});
	var lastDistance = 0;
	
	var isGoDown=false;
	var scrollProcess=function(e) {
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
				self.hideNavBar();
				Ti.App.fireEvent("app:tabgroup", {
					visible : false
				});
			} else {
				self.showNavBar();
				Ti.App.fireEvent("app:tabgroup", {
					visible : true
				});
			}

		}
		
		lastDistance = distance;
	}
	
	//tableView.addEventListener('scroll', scrollProcess);
	return self;
};
module.exports = winActivity2;
