var winLogin= function(){
	var self = Ti.UI.createWindow({		
		backgroundColor:'#eee',
		barImage:"images/top_logo.png",		
		fullscreen:false
	});
	var TopBarView = require("publicUI/TopBarView");
	var t = new TopBarView();
	self.add(t);
	
	t.addBackButton(function(e){
		self.close();
	});
	Ti.Facebook.appid ="192953927448564";// "144454838961780";
	Ti.Facebook.permissions = ['publish_stream'];
	Ti.Facebook.addEventListener('login',function(e){
		if (e.success){			
			Ti.App.fireEvent("app:registerr",{email:e.data.email,firstname:e.data.first_name,lastname:e.data.last_name});
			self.close();

		}
	});
	var tableview = Titanium.UI.createTableView();
	self.add(tableview);
	var row = Titanium.UI.createTableViewRow({height:480});
	
	var contentView = Titanium.UI.createView({
		top:40,
		left:0,
		width:320,
		height:600,
		backgroundImage:'images/login_bg.png'
	});
	row.add(contentView);
	tableview.data=[row];
	
	var facebookButton = Ti.UI.createButton({
		top:50,
		left:14,
		height:50,
		width:292,
		backgroundImage:'images/login_facebook.png'
	});
	facebookButton.addEventListener("click",function(e){
		Ti.Facebook.authorize();
	});
	contentView.add(facebookButton);
	var twitterButton = Ti.UI.createButton({
		top:100,
		left:14,
		height:50,
		width:292,
		backgroundImage:'images/login_twitter.png'
	});
	contentView.add(twitterButton);
	
	var loginButton = Ti.UI.createButton({
		top:325,
		left:14,
		height:47,
		width:292,
		backgroundImage:'images/login_login.png'
	});
	contentView.add(loginButton);
	loginButton.addEventListener('click',function(e){
		
		var userService = require("services/UserService");
		userService.login(emailText.value,passwordText.value);
		self.close();
		
	});
	
	var emailText = Titanium.UI.createTextField({
		hintText : 'Your email address',
		height : 50,
		paddingLeft : 10,
		top:210,
		left : 20,
		width : 290,
		font : {
			fontSize : 18
		},
		color : '#777',
		clearOnEdit : true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});
	contentView.add(emailText);
	var passwordText = Titanium.UI.createTextField({
		hintText : 'Password',
		height : 50,
		top:260,
		
		paddingLeft : 10,
		left : 20,
		width : 290,
		font : {
			fontSize : 18
		},
		color : '#777',
		clearOnEdit : true,
		passwordMask:true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});
	contentView.add(passwordText);
	return self;
}
module.exports = winLogin;
