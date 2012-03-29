/***************************************************
 Description : show all category on picturelistview
 Date:2012.3.28
 
***************************************************/
var winCategory=function(){
	
	var self=Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",	
		tabBarHidden:true,
		fullscreen:false
	});
	
		
	//create topbar 
	var topbarView=require('publicUI/TopBarView');
	var t =new topbarView();
	self.add(t);
	//add back button
	t.addBackButton(function(e){self.close();});
	
	//create searchbar
	var searchBar=Ti.UI.createSearchBar({
		showCancel:false,
		top:45,
		width:320,
		height:45,
		barColor:'#d1d1d1',
		text : L('search')
	});
	searchBar.addEventListener('focus',function(e){
		searchBar.showCancel=true;
	
	});
	searchBar.addEventListener('blur',function(e){
		searchBar.showCancel=false;
		
	});
	searchBar.addEventListener('cancel',function(e){
		searchBar.blur();
		searchBar.value='';
	});
	searchBar.addEventListener('return',function(e){
		searchBar.blur();
		var winPictureListView = require("ui/winPictureListView");
		var pview = new winPictureListView();
		pview.open();
		pview.showData({id:-1},searchBar.value);
	});
	self.add(searchBar);
	
	
	
	//create tableview
	var tableView = Ti.UI.createTableView({
		top:90,
		left:0,
		width:320,
		data:[L('loading_data')]
		//search:searchTag	
	});
	self.add(tableView);

	//load tableView data
	var processData=function(datas){
		
		var tbl_data = [];
		var row = Ti.UI.createTableViewRow();
		row.title = L('what_is_hot');
		row.category = {id:0,title:L('what_is_hot')}
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
		//tbl_data.push(Ti.UI.createTableViewRow());// append new empty row
			
		tableView.data = tbl_data;
		
		//add click event
		tableView.addEventListener("click", function(e) {
			searchBar.blur();
			if (e.rowData.category){
				var winPictureListView = require("ui/winPictureListView");
				var pview = new winPictureListView();
				pview.open();
				pview.showData(e.category,e.key);
			}
			
		});

		//tableView.addEventListener('scroll',scrollProcess);	
	};
	
	var categoryService = require("services/CategoryService");
	categoryService.getList(processData);
	
	
	//when received the closewindow App listener then close  2012.3.29 
	Ti.App.addEventListener('app:closeWindow',function(e){
		t.showTop(true,true);
		self.close();
		//Ti.App.removeEventListener('app:closeWindow'); //remove App listener
	});
		
	return self;
	
};
module.exports=winCategory;

