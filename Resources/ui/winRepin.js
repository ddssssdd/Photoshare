var winRepin = function(photo){
	this.photo = photo
	var self = Ti.UI.createWindow({		
		backgroundColor:'#fff',
		backButtonTitle:"Cancel",
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
		var userService = require("services/UserService");
		if (photo){
			
			userService.repin(rowBoard.cid, textDescription.value, photo.id, function(e) {
				//alert(e);
				if(e.status == 'success') {
					Ti.App.fireEvent("app:message", {
						text : L("repin_success")
					});
				}
				Ti.App.fireEvent("app:refresh.pin",{pin:e});
			});

	
		}else{
			
			Ti.App.fireEvent("app:select.board", {
				boardId : rowBoard.cid,
				description : textDescription.value
			});


		}
		
		self.close();
	});
	
	var data = [];
	data[0] = Ti.UI.createTableViewSection({headerTitle:photo?L('repin'):L('create_pin')});
	
	var userService = require("services/UserService");
	var list = userService.user.boardList;
	
	var rowBoard = Ti.UI.createTableViewRow();
	if ((list) && (list.length>0)){
		rowBoard.title = list[0].title;
		rowBoard.cid = list[0].id;
		rowBoard.hasChild = true;
	}else{
		rowBoard.title = L('select_board');
		rowBoard.cid = 0;
		rowBoard.hasChild = true;	
	}
	
	data[0].add(rowBoard);
	var rowDescription = Ti.UI.createTableViewRow({height:140});
	
	var textDescription = Ti.UI.createTextArea({
		editable : true,
		value : photo?photo.description:L('description'),
		height : 120,
		width : 300,
		top : 0,
		left:0,
		font : {
			fontSize : 18,
			fontFamily : 'Marker Felt',
			fontWeight : 'bold'
		},
		color : '#888',
		textAlign : 'left',
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE	
	})

	rowDescription.add(textDescription);
	data[0].add(rowDescription);
	
	/*
	data[1] = Ti.UI.createTableViewSection({headerTitle:"Share"});
	var rowUserName = Ti.UI.createTableViewRow({title:"share on facebook"});	
	data[1].add(rowUserName);
	
	var rowPassword = Ti.UI.createTableViewRow({title:"share on twitter"});
	
	data[1].add(rowPassword);
	*/
	var tableView = Ti.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'#fff'
	});
	
	self.add(tableView);
	tableView.addEventListener("click",function(e){
		if (e.index==0){
			var winUserBoard= require("ui/winUserBoard");
			var w = new winUserBoard();
			//w.open();
			self.tab.open(w);
		}
	});
	//Ti.App.fireEvent("app:repin.select.board",{board:e.rowData.board});
	Ti.App.addEventListener("app:repin.select.board",function(e){
		rowBoard.title = e.board.title;
		rowBoard.cid = e.board.id;
	})
	return self;
}
module.exports = winRepin;
