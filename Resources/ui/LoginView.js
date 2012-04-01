var LoginView = function(){
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
	var contentView = Titanium.UI.createView({
		top:50,
		left:0,
		width:320,
		height:420
	});
	self.add(contentView);
	
	var labelInfo = Ti.UI.createLabel({
		text : LL('app.must_have_an_account'),
		top : 10,
		left :50,
		width : 150,
		height :"auto",
		textAlign:"center"
	});
	contentView.add(labelInfo);
	var data = [];
	data[0] = Ti.UI.createTableViewSection({headerTitle:'login'});
	var rowFacebook = Ti.UI.createTableViewRow();
	
	
	Ti.Facebook.appid ="192953927448564";// "144454838961780";
	Ti.Facebook.permissions = ['publish_stream'];
	Ti.Facebook.addEventListener('login',function(e){
		if (e.success){
			alert(L('logged_in_facebook'));
			/*
			e.data	[object Object]	
	
			link	"https://www.facebook.com/profile.php?id=100001361574942"
			education	[object Array]
			id	"100001361574942"
			name	"Steven Fu"
			first_name	"Steven"
			last_name	"Fu"
			gender	"male"
			timezone	8
			locale	"en_US"
			verified	1
			updated_time	"2011-06-21T09:34:39+0000"
			*/
			Ti.App.fireEvent("app:registerr",{email:e.data.email,firstname:e.data.first_name,lastname:e.data.last_name});
			self.close();

		}
	});

	var facebookLoginButton = Ti.Facebook.createLoginButton({
		left:50,
		width:200,
		height:60,
		style:Ti.Facebook.BUTTON_STYLE_WIDE,
		backgroundImage:'images/loginfacebook.png'
	});
	rowFacebook.add(facebookLoginButton);
	data[0].add(rowFacebook);
	
	data[1] = Ti.UI.createTableViewSection({headerTitle:"or"});
	var rowUserName = Ti.UI.createTableViewRow();
	
	var emailText = Titanium.UI.createTextField({
		hintText : LL('app.your_email_address'),
		height : 32,
		
		backgroundImage : 'images/inputfield.png',
		paddingLeft : 10,
		left : 50,
		width : 220,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true
	});
	rowUserName.add(emailText);
	/*
	
	var labelEmail = Ti.UI.createLabel({
		text:"Email",
		
		left: 20,
		width: 100,
		textAlign:"right"
	});
	var textUsername = Ti.UI.createTextField({
		
		left: 150,
		height: 35,
		width:150,
		hintText:'Enter an eamil',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	rowUserName.add(labelEmail);
	rowUserName.add(textUsername);
	*/
	data[1].add(rowUserName);
	
	var rowPassword = Ti.UI.createTableViewRow();
	var passwordText = Titanium.UI.createTextField({
		hintText : LL('profile.password'),
		height : 32,
		
		backgroundImage : 'images/inputfield.png',
		paddingLeft : 10,
		left : 50,
		width : 220,
		font : {
			fontSize : 13
		},
		color : '#777',
		clearOnEdit : true,
		passwordMask:true
	});
	rowPassword.add(passwordText);
	/*
	var labelPassword = Ti.UI.createLabel({
		text:"Password",
		left:20,
		width:100,
		textAlign:"right"
	});
	var textPassword = Ti.UI.createTextField({
		left: 150,
		height: 35,
		width:150,
		hintText:'Enter an password',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_BEZEL
	});
	rowPassword.add(labelPassword);
	rowPassword.add(textPassword);
	*/
	data[1].add(rowPassword);
	
	
	data[2] = Ti.UI.createTableViewSection();
	var rowLogin = Ti.UI.createTableViewRow();
	
	
	var loginButton = Ti.UI.createButton({		
		left:120,
		width:70,
		height:31,
		backgroundImage:'images/login.png'
	});
	loginButton.addEventListener('click',function(e){
		
		var userService = require("services/UserService");
		userService.login(emailText.value,passwordText.value);
		self.close();
		
	});
	rowLogin.add(loginButton);
	data[2].add(rowLogin);
	
	var tableView = Ti.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED
		//backgroundColor:'#fff'
	});
	
	contentView.add(tableView);	
	
	Ti.App.addEventListener("app:loginSuccess",function(e){
		self.close();
	});
	tableView.addEventListener("click",function(e){
		if (e.index==0){
			Ti.Facebook.authorize();
		}
	})
	return self;
}
module.exports = LoginView;
