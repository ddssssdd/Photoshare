var winExplore=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",	
		tabBarHidden:true,
		navBarHidden:false,
		fullscreen:false		
	});

	var coverView=null,toolView=null,toolbar=null;
	var createCoverView=function() {
	
		coverView=Ti.UI.createView({
			left:0,
			top:40,
			backgroundColor:'#000',
			width:320,
			height:'440',
			opacity:0
		});
	}
	
	var createToolBar=function() {
		
		toolView = Ti.UI.createView({
			top:40,
			left:0,
			width:320,
			height:35,
			backgroundImage:'images/bottom_bg.png'
		});
		
		toolbar = Titanium.UI.iOS.createTabbedBar({
				top : 5,
				left : 10,
				width : 300,
				height : 25,
				labels : ['Pins','Boards','People'],
				backgroundColor : "#cfcfcf",// 'maroon',
				style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
				index : 0
			});
			//toolbar.
			toolView.add(toolbar);
			
			toolbar.addEventListener('click',function(e){
				switch(e.index){
					case 0:
					break;
					case 1:
					break;
					case 2:
					break;
				}
			});
			
	}
	
	
	var searchTag = Ti.UI.createSearchBar({
		left:0,
		top:0,
		width:320,
		height:45,		
		barColor:'#d1d1d1',
		//borderColor:'#aaa',
		text : LL('search')
	});
	self.add(searchTag);
	searchTag.addEventListener("focus",function(e){
		searchTag.showCancel = true;
		//hide navbar and tabbar
		self.hideNavBar();
		customTabGroup.hide();
		
		//show cover view
		if (coverView) {
			self.remove(coverView);
			coverView=null;
		}
		createCoverView();
		self.add(coverView);
		coverView.animate({duration:300,opacity:0.5});
		
		//show toolbar
		if (toolView) {
			self.remove(toolView);
			toolView=null,toolbar=null;
		}
		createToolBar();
		self.add(toolView);
		//toolbar.show();
	});
	searchTag.addEventListener("blur",function(e){
		searchTag.showCancel = false;
		
		//show navbar, tabbar
		self.showNavBar();
		customTabGroup.show();
		coverView.animate({duration:300,opacity:0});
		
		toolbar.hide();
	});
	
	searchTag.addEventListener("return",function(e){
		searchTag.blur();
		//alert(searchTag.value);
		Ti.App.fireEvent("app:openWindow",{category:{id:-1},key:searchTag.value});
	});
	searchTag.addEventListener("cancel",function(e){
		searchTag.blur();
		searchTag.value="";
		if (toolView) {
			self.remove(toolView);
		}
	});
	
	
	var tableView = Ti.UI.createTableView({
		top:45,
		left:0,
		width:320,
		data:[LL('loading_data')]
		//search:searchTag	
	});
	self.add(tableView);
	
	var processData=function(datas){
		
		var tbl_data = [];
		var row = Ti.UI.createTableViewRow();
		row.title = LL('what_is_hot');
		row.category = {id:0,title:LL('what_is_hot')}
		row.hasChild = true;
		tbl_data.push(row);
		for(var i = 0; i < datas.length; i++) {
			var tag = datas[i];
			var row = Ti.UI.createTableViewRow();
			row.title = tag.title;
			row.category = tag
			row.hasChild = true;
			tbl_data.push(row);
		}
		tbl_data.push(Ti.UI.createTableViewRow());
			
		tableView.data = tbl_data;
		tableView.addEventListener("click", function(e) {
			if (e.rowData.category){
				Ti.App.fireEvent("app:openWindow",{category:e.rowData.category});	
			}
			
		});

		tableView.addEventListener('scroll',scrollProcess);	
	};
	var categoryService = require("services/CategoryService");
	categoryService.getList(processData);
	self.addEventListener("focus",function(e){
		Ti.App.fireEvent("app:tabgroup",{visible:true});
	});
	
	
	
	var lastDistance = 0;
	var isGoDown=false;
	var isShow = true;
	var scrollProcess= function(e) {
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;


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
	//tableView.addEventListener('scroll',scrollProcess);
	
	return self;
};
module.exports = winExplore;
