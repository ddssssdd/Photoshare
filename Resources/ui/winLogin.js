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
		Ti.Facebook.removeEventListener("login",loginSuccess);
		self.close();
	});
	
	//show topbarview 2012.3.27
	t.showTop(true,true);
		
	
	var loginSuccess=function(e){
		if (e.success){
			facebookLogin();			
		}
		
	}
	Ti.Facebook.appid ="192953927448564";// "144454838961780";
	Ti.Facebook.permissions = ['publish_stream'];
	Ti.Facebook.addEventListener('login',loginSuccess);
	var tableview = Titanium.UI.createTableView();
	tableview.scrollable=false;
	self.add(tableview);
	var row = Titanium.UI.createTableViewRow({height:480});
	
	var contentView = Titanium.UI.createView({
		top:40,
		left:0,
		width:320,
		height:600,
		backgroundImage:'images/'+settings.countryCode+'/login_bg.png'
	});
	row.add(contentView);
	tableview.data=[row];
	
	var facebookButton = Ti.UI.createButton({
		top:50,
		left:14,
		height:50,
		width:292,
		backgroundImage:'images/'+settings.countryCode+'/login_facebook.png'
	});
	function facebookLogin(){
		Ti.Facebook.removeEventListener("login",loginSuccess);
		var userService = require("services/UserService");
		userService.loginWithFacebook(Ti.Facebook.getUid(),Ti.Facebook.accessToken);
		self.close();
		
		//send the message to tell other window close 2012.3.29
		Ti.App.fireEvent('app:closeWindow',{});
	}
	facebookButton.addEventListener("click",function(e){
		if (Ti.Facebook.loggedIn){
			//Ti.API.info(Ti.Facebook.getUid());
			//Ti.API.info(Ti.Facebook.accessToken);
			facebookLogin();
		}else{
			Ti.Facebook.authorize();	
		}
		
	});
	contentView.add(facebookButton);
	/*var twitterButton = Ti.UI.createButton({
		top:100,
		left:14,
		height:50,
		width:292,
		backgroundImage:'images/'+settings.countryCode+'/login_twitter.png'
	});
	contentView.add(twitterButton);*/
	
	var loginButton = Ti.UI.createButton({
		top:325,
		left:14,
		height:47,
		width:292,
		backgroundImage:'images/'+settings.countryCode+'/login_login.png'
	});
	contentView.add(loginButton);
	loginButton.addEventListener('click',function(e){
		//self.fireEvent('app:login');
		login();
	});
	
	var login=function(){
		var userService = require("services/UserService");
		userService.login(emailText.value,passwordText.value);
		self.close();
		
		//send the message to tell other window close 2012.3.29
		Ti.App.fireEvent('app:closeWindow',{});
		
	}
		
	var emailText = Titanium.UI.createTextField({
		id:'txtEmail',
		hintText : LL('your_email_address'),
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
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		keyboardType:Ti.UI.KEYBOARD_EMAIL,
		returnKeyType:Ti.UI.RETURNKEY_NEXT
	});
	var isFirst=false;
	
	
	var showUp=function(arg) {
		contentView.animate({top:-150,duration:500},function(e){
				contentView.top=-150;
				if (arg.id=='txtEmail') {
					emailText.focus();
				}else {
					passwordText.focus();
				}
			});
	}
	var showDown=function() {
		contentView.animate({top:40,duration:500},function(e){
			contentView.top=40;
			passwordText.blur();
		});
	}

	emailText.addEventListener('focus',function(e){
		if (contentView.top==-150) {
			return;
		}
		showUp({id:emailText.id});
	});
	
	emailText.addEventListener('return',function(e){
		passwordText.focus();
	})
	
	/*self.addEventListener('focus',function(e){
		showUp({id:'txtEmail'});
	});*/

	contentView.add(emailText);
	var passwordText = Titanium.UI.createTextField({
		id:'txtPwd',
		hintText : LL('password'),
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
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType:Ti.UI.RETURNKEY_DONE
	});
	
	passwordText.addEventListener('focus',function(e){
		if (contentView.top==-150) {
			return;
		}
		showUp({id:passwordText.id});
	});
	passwordText.addEventListener('return',function(e){
		showDown();
		login();
		//customTabGroup.setHighlightBar(4);
	})
	
	contentView.add(passwordText);
	return self;
}
module.exports = winLogin;
