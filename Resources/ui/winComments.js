var winComments = function(photo){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		backButtonTitle:"Cancel",
		barImage:"images/top_logo.png",
		navBarHidden:false,
		tabBarHidden:false,
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
		//alert(textDescription.value);		
		self.close();
		var userService = require("services/UserService");
		userService.comment(photo.id,textDescription.value,function(e){
			Ti.App.fireEvent("app:refresh.pin",{pin:e});
		})
	});
	
	var tableview = Titanium.UI.createTableView({
		backgroundColor:'#fff',
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
	});
	self.add(tableview);
	var data=[];
	data[0] = Ti.UI.createTableViewSection({headerTitle:LL('global.pin.comment_button')});
	
	var row = Titanium.UI.createTableViewRow({height:'150'});
	
	
	
	var textDescription = Ti.UI.createTextArea({
		editable : true,
		value : '',
		height : 140,
		width : 280,		
		font : {
			fontSize : 14,
		},
		top : 0,
		left:5,	
		textAlign : 'left',		
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE		
	})

	row.add(textDescription);
	data[0].add(row);
	tableview.data = data;
	return self;
}
module.exports = winComments;
