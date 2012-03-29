var winRepin = function(photo,imageObj){
	this.photo = photo
	var self = Ti.UI.createWindow({		
		backgroundColor:'#fff',
		backButtonTitle:"Cancel",
		barImage:"images/top_logo.png",
		navBarHidden:false,
		tabBarHidden:true,
		fullscreen:false
	});
	/*
	var BackNavButton = require("publicUI/BackNavButton");
	new BackNavButton(self);
	*/
	var cancelButton=Titanium.UI.createButton({
		width:62,
		height:28,
		backgroundImage:'images/cancel.png'
	});
	self.leftNavButton = cancelButton;
	cancelButton.addEventListener("click",function(e){
		self.close();
	});
	var saveButton = Titanium.UI.createButton({
		backgroundImage:'images/pinit.png',
		width : 62,
		height: 28
	});
	self.rightNavButton = saveButton;
	var saveProcess=function(e){
		var userService = require("services/UserService");
		if (photo){
			if (rowBoard.cid==0) {
				Ti.App.fireEvent('app:message',{text:'board cannot be empty!'});
				return;
			}
			userService.repin(rowBoard.cid, textDescription.value, photo.id, function(e) {
				//alert(e);
				if(e.status == 'success') {
					Ti.App.fireEvent("app:message", {
						text : L("repin_success")
					});
					
					//update profile pins count 2012.3.28
					Ti.App.fireEvent('app:updateProfile',{pin:1}); //pin+1
				}
				Ti.App.fireEvent("app:refresh.pin",{pin:e}); //include show + operate 
			});

	
		}else{
			/*
			Ti.App.fireEvent("app:select.board", {
				boardId : rowBoard.cid,
				description : textDescription.value
			});
			*/
			var userService= require("services/UserService");
			userService.createPin(imageObj,rowBoard.cid,textDescription.value,function(e){
			Ti.App.fireEvent("app:message",{text:L('create_pin_success')});	
			self.close();	
			
			//show + 2012.3.29
			Ti.App.fireEvent('app:pinInfo',{text:e.thisOperPoint});	
		});	

		}
		
		self.close();
	}
	saveButton.addEventListener("click",saveProcess);
	
	
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
		//value : photo?photo.description:L('description'),
		value:'',
		height : 120,
		width : 300,
		top : 0,
		left:0,
		font : {
			fontSize : 16
			
		},
		color : '#888',
		textAlign : 'left',
		clearOnEdit: true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType:Ti.UI.RETURNKEY_DONE
	})

	rowDescription.add(textDescription);
	data[0].add(rowDescription);
	textDescription.addEventListener("return",function(e){
		saveProcess();
	})
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
