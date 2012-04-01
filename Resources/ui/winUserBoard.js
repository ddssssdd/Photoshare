var winUserBoard = function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',		
		barImage:"images/top_bg.png",
		navBarHidden:false,
		tabBarHidden:true,
		fullscreen:false
	});
	
	var BackNavButton = require("publicUI/BackNavButton");
	new BackNavButton(self);
		
	var addButton = Titanium.UI.createButton({		
		width : 125,
		height: 28,
		backgroundImage:'images/'+settings.countryCode+'/addboard.png'
	});
	self.rightNavButton = addButton;
	addButton.addEventListener("click",function(e){
		//add
		var winCreateBoard = require("ui/winCreateBoard");
		var win = new winCreateBoard();
		self.tab.open(win);
	});
	
	Ti.App.addEventListener("app:createBoard",function(e){
		setTimeout(function(){
			if (e.boardInfo.status=="success"){
				Ti.App.fireEvent("app:repin.select.board",{board:e.boardInfo.board});
				self.close();	
			}
		},500);
		
	})
	
	var tableview = Ti.UI.createTableView({
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'#fff'
	});
	self.add(tableview);
	
	var data=[];
	data[0] = Ti.UI.createTableViewSection({headerTitle:LL('app.select_collection')})   //old value: Board List
	
	var processData=function(datas){
		
		for(var i=0;i<datas.length;i++){
			var row = Ti.UI.createTableViewRow();
			row.title= datas[i].title;
			row.board = datas[i];
			row.hasCheck = false;
			data[0].add(row);	
		}
		tableview.data = data;
	}
	var userService = require("services/UserService");
	var user = userService.user();
	if ((user.boardList) && (user.boardList.length>0)){
		processData(user.boardList);
	}else{
		userService.getBoards(user.id,processData);	
	}
	
	tableview.addEventListener("click",function(e){
		Ti.App.fireEvent("app:repin.select.board",{board:e.rowData.board});
		self.close();
	})
	return self;
}
module.exports = winUserBoard;
