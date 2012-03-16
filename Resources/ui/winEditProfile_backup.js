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
	var userService = require("services/UserService");
	var user = userService.user;
	var data = [];
	data[0] = Ti.UI.createTableViewSection({headerTitle:'Edit Profile'});
	var addInfo=function(lbl,v,index){
		var row = Ti.UI.createTableViewRow();
		var label = Ti.UI.createLabel({
			text:lbl,
			right:150,
			height:50,
			textAlign:"right"
		});
		row.add(label);
		v.left =160;
		v.height = 40;
		row.add(v);
		
		data[index].add(row);	
	}
	
	var emailText = Titanium.UI.createTextField({
		hintText : 'email address',
		height : 35,		
		backgroundImage : 'images/inputfield.png',
		paddingLeft : 10,		
		width : 135,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true,
		value:user.userName
	});
	addInfo("*Email Address",emailText,0);
	/*
	var emailBtn = Ti.UI.createButton({
		title:"Email Settting"		
	})
	emailBtn.addEventListener("click",function(e){
		Ti.App.fireEvent("app.openWindow",{tab:"winProfile",url:"emailSettting"});
	});
	addInfo("Email Setting",emailBtn,0);
	
	var passwordBtn = Ti.UI.createButton({
		title:"Change Password"		
	})
	passwordBtn.addEventListener("click",function(e){
		Ti.App.fireEvent("app.openWindow",{tab:"winProfile",url:"changePassword"});
	});
	addInfo("*Password",passwordBtn,0);
	*/
	
	var firstnameText = Titanium.UI.createTextField({
		hintText : '',
		height : 35,		
		backgroundImage : 'images/inputfield.png',
		paddingLeft : 10,		
		width : 135,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true,
		value:user.source.firstName
	});
	addInfo("*First Name",firstnameText,0);
	
	var lastnameText = Titanium.UI.createTextField({
		hintText : '',
		height : 35,		
		backgroundImage : 'images/inputfield.png',
		paddingLeft : 10,		
		width : 135,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true,
		value:user.source.lastName
	});
	addInfo("*Last name",lastnameText,0);
	
	/*
	var deleteBtn = Ti.UI.createButton({
		title:"Delete Account"		
	})
	deleteBtn.addEventListener("click",function(e){
		Ti.App.fireEvent("app.openWindow",{tab:"winProfile",url:"changePassword"});
	});
	addInfo("Delete Account",deleteBtn,0);
	*/
	
	var saveButton = Ti.UI.createButton({
		title:"Save Profile",
		left:80,
		height:40,
		width:120
	})
	saveButton.addEventListener("click",function(e){
		Ti.App.fireEvent("app.saveProfile");
	})
	var row= Ti.UI.createTableViewRow();
	row.add(saveButton);
	data[0].add(row);
	
	//data[1] = Ti.UI.createTableViewSection({headerTitle:'Email Settings'});
	//data[2] = Ti.UI.createTableViewSection({headerTitle:'Change Password'});
	
	
	
	var tableview = Ti.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
	});
	self.add(tableview);
	
	return self;
}
module.exports = winEditProfile;
