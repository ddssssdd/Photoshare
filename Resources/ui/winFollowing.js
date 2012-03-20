var winFollowing=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		fullscreen:false,
		navBarHidden:false
	});
	
	
	
	var CustomTableView = require("publicUI/CustomTableView");
	var tableView = new CustomTableView(self);
	self.add(tableView);
	
	var isRefresh=false;
	/***********pull refresh component*******************/
	var tableHeader=require('publicUI/TableViewPullRefresh');
	new tableHeader(tableView,function(e){
		Ti.API.info('pull refresh load data');
		isRefresh=true; //flag
		tableView.data=[];
		self.loadData();
	});
	
	
	self.add(tableView);
	
	var pageIndex=0;
	var pageCount=10;
	var rowindex=0;
	var processData = function(datas,isGet){		
		
		tableView.removeScrollListener();
		for(var i=0;i<datas.length;i++){
			var f = datas[i];
			
			var row = Ti.UI.createTableViewRow({height:"auto"});
			var PicturePartView = require("ui/PicturePartView");
			var pview = new PicturePartView(f,f.photo,rowindex);
			row.add(pview);		
			tableView.appendRow(row);			
			rowindex++;
		}
		
		tableView.addScrollListener();
			
		if (isGet){
			pageIndex++;
		}
		tableView.updating = false;	
		isLoading = false;
	};
	self.loadData=function(){
		
		var userService = require("services/UserService");
		if(!userService.isLogin()) {
			return;
		}
		if(isRefresh){
			pageIndex=0;
		}
		if (pageIndex<=pageCount){
			isLoading = true;
			tableView.updating=true;
			var categoryService = require("services/CategoryService");
			categoryService.getFollowingLatest(pageIndex*10+1,processData);	
		}
	}
	Ti.App.addEventListener("app:loginSuccess",function(e){
		pageIndex =0;
		self.loadData();
	});	
	
	Ti.App.addEventListener("app:deletePin",function(e){
		if (e.rowindex){
			tableView.deleteRow(e.rowindex);
		}
	});
	var isFirstOpen=true;
	self.addEventListener("focus",function(e){
		if (isFirstOpen){
			self.loadData();
			isFirstOpen= false;
		}
		
	});
	Ti.App.addEventListener("app:logout",function(e){
		tableView.data=[];
		isFirstOpen = true;
	});
	
	
	return self;
};
module.exports = winFollowing;
