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
	
	//show topbarview 2012.3.27
	t.showTop(true,true);
	
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
	tableview.scrollable=false;
	self.add(tableview);
	var row = Titanium.UI.createTableViewRow({height:480});
	
	var contentView = Titanium.UI.createView({
		top:40,
		left:0,
		width:320,
		height:600,
		backgroundImage:'images/'+settings.countryCode+'/register_bg.png'
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
	facebookButton.addEventListener("click",function(e){
		Ti.Facebook.authorize();
	});
	contentView.add(facebookButton);
	var twitterButton = Ti.UI.createButton({
		top:100,
		left:14,
		height:50,
		width:292,
		backgroundImage:'images/'+settings.countryCode+'/login_twitter.png'
	});
	contentView.add(twitterButton);
	
	var showUp=function(arg) {
		contentView.animate({top:-110,duration:500},function(e){
				contentView.top=-110;
				switch(arg.id){
					case 'txtEmail':
						emailText.focus();
					break;
					case 'txtFirstName':
						firstnameText.focus();
					break;
					case 'txtLastName':
						lastnameText.focus();
					break;
					case 'txtPwd':
						passwordText.focus();
					break;
				}
			});
	}
	var showDown=function() {
		contentView.animate({top:40,duration:500},function(e){
			contentView.top=40;
			passwordText.blur();
		});
	}
	var setFocus=function(e) {
		if (contentView.top==-110) {
			return;
		}
		showUp({id:e.source.id});
	};
	
	
	
	var emailText = Titanium.UI.createTextField({
		id:'txtEmail',
		hintText : LL('your_email_address'),
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
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		keyboardType:Ti.UI.KEYBOARD_EMAIL,
		returnKeyType:Ti.UI.RETURNKEY_NEXT
	});
	emailText.addEventListener('return',function(e){
		firstnameText.focus();
	});
	emailText.addEventListener('focus',function(e){
		setFocus(e);
	});
	contentView.add(emailText);
	var firstnameText = Titanium.UI.createTextField({
		id:'txtFirstName',
		hintText : LL('first_name'),
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
		clearOnEdit : true,
		returnKeyType:Ti.UI.RETURNKEY_NEXT
	});
	firstnameText.addEventListener('return',function(e){
		lastnameText.focus();
	});
	firstnameText.addEventListener('focus',function(e){
		setFocus(e);
	})
	contentView.add(firstnameText);	
	var lastnameText = Titanium.UI.createTextField({
		id:'txtLastName',
		hintText : LL('last_name'),
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
		clearOnEdit : true,
		returnKeyType:Ti.UI.RETURNKEY_NEXT
	});
	lastnameText.addEventListener('return',function(e){
		passwordText.focus();
	});
	lastnameText.addEventListener('focus',function(e){
		setFocus(e);
	});
	contentView.add(lastnameText);
	var passwordText = Titanium.UI.createTextField({
		id:'txtPwd',
		hintText : LL('password'),
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
		passwordMask:true,
		returnKeyType:Ti.UI.RETURNKEY_DONE
	});
	contentView.add(passwordText);
	passwordText.addEventListener('focus',function(e){
		setFocus(e);
	});
	passwordText.addEventListener("return",function(e){
		 showDown();
		 passwordText.blur();
		 register();
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
		backgroundImage:'images/'+settings.countryCode+'/register_signup.png'
	});
	contentView.add(registerButton);
	
	var register=function(){
		/*
		self.close();
		Ti.App.fireEvent("app:register.newUser",{email:emailText.value,
			firstname:firstnameText.value,
			lastname:lastnameText.value,
			password:passwordText.value})
		*/
		if (!emailText.value){
			Ti.App.fireEvent("app:message",{text:LL('email_cannot_be_empty')});
			emailText.focus();
			return;
		}
		if (!firstnameText.value){
			Ti.App.fireEvent("app:message",{text:LL('firstname_cannot_be_empty')});
			firstnameText.focus();
			return;
		}
		
		if (!lastnameText.value){
			Ti.App.fireEvent("app:message",{text:LL('lastname_cannot_be_empty')});
			lastnameText.focus();
			return;
		}
		if (!passwordText.value){
			Ti.App.fireEvent("app:message",{text:LL('password_cannot_be_empty')});
			passwordText.focus();
			return;
		}
		
		var userService = require("services/UserService");
		userService.register(emailText.value,passwordText.value,firstnameText.value,lastnameText.value,function(r){
			if (r.status!="success"){
				//alert(r.memo);
				Ti.App.fireEvent("app:message",{text:r.memo});
			}else{
				
				//show + 2012.3.29
				if (r.thisOperPoint) {
					Ti.App.fireEvent('app:pinInfo',{text:r.thisOperPoint});	
				}
				self.close();
			}
		});
	};
	
	registerButton.addEventListener("click",function(e){
		register();
	});
	
	
	return self;
}
module.exports = winRegister;
