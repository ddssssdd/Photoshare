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
	
	var createProcess=function(e){
		if (!titleText.value){
			titleText.focus();
			Ti.App.fireEvent("app:message",{text:"Collection name is required."});
			return;
		}
		//save
		var userService = require("services/UserService");
		userService.createBoard(titleText.value,row2.cid,function(e){		
			if (e.status=="success"){
				self.close();
				Ti.App.fireEvent("app:createBoard",{boardInfo:e});	
				
				//update profile collections count 2012.3.28
				Ti.App.fireEvent('app:updateProfile',{collection:1});
				
				//show + 2012.3.29
				Ti.App.fireEvent('app:pinInfo',{text:e.thisOperPoint});
				
			}else{
				Ti.App.fireEvent("app:message",{text:e.memo});
			}	
			
			
		})
	}
	saveButton.addEventListener("click",createProcess);
	var tableview = Ti.UI.createTableView({
		data:[LL('global.pins.loading')],
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'#fff'
	});
	self.add(tableview);
	
	var data = [];
	data[0] = Ti.UI.createTableViewSection({headerTitle:LL('app.collection_title')});
	var titleText = Titanium.UI.createTextField({
		hintText : LL('app.new_collection_name'),  //old value: Collection title
		height : 32,
		left: 0,		
		paddingLeft : 10,		
		width : 280,
		font : {
			fontSize : 18
		},
		color : '#777',
		clearOnEdit : true,		
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType:Ti.UI.RETURNKEY_DONE
	});
	titleText.addEventListener("return",createProcess);
	var row1 = Ti.UI.createTableViewRow();
	row1.add(titleText);
	data[0].add(row1);
	var row2  = Ti.UI.createTableViewRow();
	
	data[0].add(row2);
	
	
	data[1] = Ti.UI.createTableViewSection({headerTitle:LL('app.select_category')});
	
	
	
	var processData = function (){
		row2.title = list[0].title;	
		row2.cid = list[0].id;
		for(var i = 0; i < list.length; i++) {
			var row = Ti.UI.createTableViewRow();
			row.title = list[i].title;
			
			data[1].add(row);
		}
		tableview.data = data;
		tableview.addEventListener("click", function(e) {
			//alert(list[e.index-2]);
			if(e.index > 1) {
				row2.title = list[e.index - 2].title;
				row2.cid = list[e.index - 2].id;
				tableview.scrollToTop(0);
			}

		});


	}
	var userService = require("services/UserService");
	var list = userService.user().categoryList;
	if (!((list) && (list.length>0))){
		var CategoryService = require("services/CategoryService");
		CategoryService.getList(function(datas){
			list = datas;
			processData();
		});
		
	}else{
		processData();
	}
	return self;
}
module.exports = winCreateBoard;
