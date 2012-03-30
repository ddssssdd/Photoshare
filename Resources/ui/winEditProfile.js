var winEditProfile = function(){
	var self = Ti.UI.createWindow({
		tabBarHidden : true,
		backgroundColor:'#fff',		
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:false,
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
				
		self.close();
		
	});
	
	var userService = require("services/UserService");
	var user = userService.user();
	var tableview = Titanium.UI.createTableView({
		backgroundColor:'#fff',
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
	});
	self.add(tableview);
	var data = [];
	data[0] = Ti.UI.createTableViewSection({headerTitle:LL('edit_profile')});
	var row = Titanium.UI.createTableViewRow({height:'auto'});
		
	var h=35;
	var emailText = Titanium.UI.createTextField({
		hintText : LL('email_address'),
		height : h,		
		top:10,
		left:20,
		paddingLeft : 10,		
		width :280,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true,
		value:user.userName,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});
	row.add(emailText);
	var row2 = Titanium.UI.createTableViewRow({height:'auto'});
	
	var firstnameText = Titanium.UI.createTextField({
		hintText : '',
		height : h,		
		top:10,
		left:10,
		paddingLeft : 10,		
		width : 280,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true,
		value:user.source.firstName,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});
	row2.add(firstnameText);
	var row3 = Titanium.UI.createTableViewRow({height:'auto'});
	var lastnameText = Titanium.UI.createTextField({
		hintText : '',
		height : h,		
		top:10,
		left:10,
		paddingLeft : 10,		
		width : 280,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true,
		value:user.source.lastName,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});
	row3.add(lastnameText);
	data[0].add(row);
	data[0].add(row2);
	data[0].add(row3);
	tableview.data = data;
	
	
	
	var saveButton = Ti.UI.createButton({
		title:LL('save_profile'),
		left:80,
		height:40,
		width:120
	})
	saveButton.addEventListener("click",function(e){
		Ti.App.fireEvent("app.saveProfile");
	});
	return self;
}
module.exports = winEditProfile;
