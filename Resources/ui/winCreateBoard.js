var winCreateBoard=function(e){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',		
		barImage:"images/top_logo.png",
		navBarHidden:false,
		tabBarHidden:true,
		fullscreen:false
	});
	var BackNavButton = require("publicUI/BackNavButton");
	new BackNavButton(self);
	var saveButton = Titanium.UI.createButton({
		backgroundImage:'images/save.png',
		width : 59,
		height: 28
	});
	self.rightNavButton = saveButton;
	saveButton.addEventListener("click",function(e){
		//save
		var userService = require("services/UserService");
		userService.createBoard(titleText.value,row2.cid,function(e){			
			self.close();
			Ti.App.fireEvent("app:createBoard",{boardInfo:e});
		})
	});
	
	var tableview = Ti.UI.createTableView({
		data:[L('loading')],
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'#fff'
	});
	self.add(tableview);
	var userService = require("services/UserService");
	var list = userService.user.categoryList;
	
	var data = [];
	data[0] = Ti.UI.createTableViewSection({headerTitle:L('collection_title')});
	var titleText = Titanium.UI.createTextField({
		hintText : L('new_collection_name'),  //old value: Collection title
		height : 32,
		left: 0,		
		paddingLeft : 10,		
		width : 280,
		font : {
			fontSize : 18
		},
		color : '#777',
		clearOnEdit : true,		
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});
	var row1 = Ti.UI.createTableViewRow();
	row1.add(titleText);
	data[0].add(row1);
	var row2  = Ti.UI.createTableViewRow();
	row2.title = list[0].title;	
	row2.cid = list[0].id;
	data[0].add(row2);
	
	
	data[1] = Ti.UI.createTableViewSection({headerTitle:L('select_category')});
	for(var i=0;i<list.length;i++){
		var row = Ti.UI.createTableViewRow();
		row.title = list[i].title;
		data[1].add(row);
	}
	tableview.data = data;
	tableview.addEventListener("click",function(e){
		//alert(list[e.index-2]);
		if (e.index>1){
			row2.title = list[e.index-2].title;
			row2.cid = list[e.index-2].id;	
		}
		
	});
	
	
	return self;
}
module.exports = winCreateBoard;
