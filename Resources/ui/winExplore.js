var winExplore=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",	
		tabBarHidden:true,
		navBarHidden:false,
		fullscreen:false		
	});
	var searchTag = Ti.UI.createSearchBar({
		left:0,
		top:0,
		width:320,
		height:45,
		barColor:'#d1d1d1',
		text : "search",
		showCancel:true
	});
	self.add(searchTag);
	searchTag.addEventListener("return",function(e){
		searchTag.blur();
		//alert(searchTag.value);
		Ti.App.fireEvent("app:openWindow",{category:{id:0},key:searchTag.value});
	});
	searchTag.addEventListener("cancel",function(e){
		searchTag.blur();
		searchTag.value="";
	});

	var tableView = Ti.UI.createTableView({
		top:45,
		left:0,
		width:320,
		data:["Loading data..."]
		//search:searchTag	
	});
	self.add(tableView);
	
	var processData=function(datas){
		
		var tbl_data = [];
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

	
	};
	var categoryService = require("services/CategoryService");
	categoryService.getList(processData);
	self.addEventListener("focus",function(e){
		Ti.App.fireEvent("app:tabgroup",{visible:true});
	});
	return self;
};
module.exports = winExplore;
