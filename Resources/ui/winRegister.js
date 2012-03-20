var winRegister = function(param){
	var self = Ti.UI.createWindow({		
		backgroundColor:'#fff',		
		barImage:"images/top_logo.png",
		fullscreen:false
	});
	var TopBarView = require("publicUI/TopBarView");
	var t = new TopBarView();
	self.add(t);
	t.addBackButton(function(e){
		self.close();
	})
	t.addBackButton(function(e){
		self.close();
	});
	Ti.Facebook.appid ="192953927448564";// "144454838961780";
	Ti.Facebook.permissions = ['publish_stream'];
	Ti.Facebook.addEventListener('login',function(e){
		if (e.success){
			firstnameText.value = e.data.first_name;
			lastnameText.value = e.data.last_name;
			emailText.value = e.data.email;
			passwordText.focus();

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
		backgroundImage:'images/register_bg.png'
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
	
	
	var emailText = Titanium.UI.createTextField({
		hintText : L('your_email_address'),
		height : 50,
		top : 195,		
		paddingLeft : 10,
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
	var firstnameText = Titanium.UI.createTextField({
		hintText : L('first_name'),
		height : 50,
		top : 245,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		paddingLeft : 10,
		left : 20,
		width : 145,
		font : {
			fontSize : 18
		},
		color : '#777',
		clearOnEdit : true
	});
	contentView.add(firstnameText);	
	var lastnameText = Titanium.UI.createTextField({
		hintText : L('last_name'),
		height : 50,
		top : 245,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		paddingLeft : 10,
		left : 165,
		width : 145,
		font : {
			fontSize : 18
		},
		color : '#777',
		clearOnEdit : true
	});
	contentView.add(lastnameText);
	var passwordText = Titanium.UI.createTextField({
		hintText : L('password'),
		height : 50,
		top : 292,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		paddingLeft : 10,
		left : 20,
		width : 290,
		font : {
			fontSize : 18
		},
		color : '#777',
		clearOnEdit : true,
		passwordMask:true
	});
	contentView.add(passwordText);
	
	passwordText.addEventListener("blur",function(e){
			
	});
	
	if (param){
		emailText.text = param.email;
		firstnameText.text = param.firstname;
		lastnameText.text = param.lastname;
	}
	var registerButton = Ti.UI.createButton({		
		top:355,
		left: 14,
		width:290,
		height: 47,
		backgroundImage:'images/register_signup.png'
	});
	contentView.add(registerButton);
	registerButton.addEventListener("click",function(e){
		/*
		self.close();
		Ti.App.fireEvent("app:register.newUser",{email:emailText.value,
			firstname:firstnameText.value,
			lastname:lastnameText.value,
			password:passwordText.value})
		*/
		if (!emailText.value){
			Ti.App.fireEvent("app:message",{text:L('email_cannot_be_empty')});
			emailText.focus();
			return;
		}
		if (!firstnameText.value){
			Ti.App.fireEvent("app:message",{text:L('firstname_cannot_be_empty')});
			firstnameText.focus();
			return;
		}
		
		if (!lastnameText.value){
			Ti.App.fireEvent("app:message",{text:L('lastname_cannot_be_empty')});
			lastnameText.focus();
			return;
		}
		if (!passwordText.value){
			Ti.App.fireEvent("app:message",{text:L('password_cannot_be_empty')});
			passwordText.focus();
			return;
		}
		
		var userService = require("services/UserService");
		userService.register(emailText.value,passwordText.value,firstnameText.value,lastnameText.value,function(r){
			if (r.status!="success"){
				//alert(r.memo);
				Ti.App.fireEvent("app:message",{text:r.memo});
			}else{
				self.close();
			}
		});
	});
	
	
	return self;
}
module.exports = winRegister;
