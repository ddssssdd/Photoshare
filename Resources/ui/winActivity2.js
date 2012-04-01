var winActivity2=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:false,
		fullscreen:false
	});
	Ti.App.fireEvent("app:tabgroup",{visible:true});
	var CustomTableView = require("publicUI/CustomTableView");
	var tableView = new CustomTableView(self);
	tableView.selectionStyle=Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	self.add(tableView);
	
	
	/***********pull refresh component*******************/
	var tableHeader=require('publicUI/TableViewPullRefresh');
	new tableHeader(tableView,function(e){
		Ti.API.info('pull refresh load data');
		
		tableView.data=[];
		self.loadData_refresh();
	});
	var processData = function(datas){
		//Remove tableview scroll event when unloaded the data 
		//tableView.removeEventListener('scroll',scrollProcess);
		tableView.removeScrollListener();
		var tbl_data= [];
		for(var i=0;i<datas.length;i++){
			var f = datas[i];
			var row = Ti.UI.createTableViewRow({height:'auto'});
			var UserPinsView = require("publicUI/UserActivityPinsView");
			var pview = new UserPinsView(f);
			row.add(pview);
			tbl_data.push(row);
		}
		tbl_data.push(Ti.UI.createTableViewRow({height:45}));
		tableView.data = tbl_data;
		isloading = true;
		tableView.addScrollListener();
		//tableView.addEventListener('scroll',scrollProcess);	
	};
	var isloading=false;
	
	self.loadData_refresh=function(){
		var categoryService = require("services/CategoryService");
		categoryService.getActivityList(processData);	
	}
	self.addEventListener("focus",function(e){
		if (!isloading){
			self.loadData_refresh();		
		}else{
			if (tableView.data.length=[]){
				self.loadData_refresh();
			}
		}		
		
	});	
	
	Ti.App.addEventListener("app:logout",function(e){
		tableView.data=[];
		isloading = false;
	});
	
	return self;
};
module.exports = winActivity2;
