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
		Ti.Facebook.removeEventListener("login",loginSuccess);
		self.close();
	})
	t.addBackButton(function(e){
		Ti.Facebook.removeEventListener("login",loginSuccess);
		self.close();
	});
	
	
	
	
	//show topbarview 2012.3.27
	t.showTop(true,true);
	
	
	var loginSuccess=function(e){
		if (e.success){
			Ti.Facebook.removeEventListener("login",loginSuccess);
			var userService = require("services/UserService");
			userService.registerWithFacebook(Ti.Facebook.uid,
				Ti.Facebook.accessToken,
				 e.data.email,
				 e.data.gender,
				 e.data.first_name,
				 e.data.last_name, function(r) {
				if(r.status != "success") {
					//alert(r.memo);
					Ti.App.fireEvent("app:message", {
						text : r.memo
					});
				} else {

					//show + 2012.3.29
					if(r.thisOperPoint) {
						Ti.App.fireEvent('app:pinInfo', {
							text : r.thisOperPoint
						});
					}
					self.close();
				}
			});


		}
	};
	
	Ti.Facebook.appid ="192953927448564";// "144454838961780";
	Ti.Facebook.permissions = ['publish_stream'];
	Ti.Facebook.addEventListener('login',loginSuccess);
	var tableview = Titanium.UI.createTableView();
	tableview.scrollable=false;
	self.add(tableview);
	var row = Titanium.UI.createTableViewRow({height:'auto'});
	
	
	
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
		if (Ti.Facebook.loggedIn){
			Ti.Facebook.logout();
		}
		Ti.Facebook.authorize();
	});
	function facebookRegister(){
		
	}
	contentView.add(facebookButton);
	/*var twitterButton = Ti.UI.createButton({
		top:100,
		left:14,
		height:50,
		width:292,
		backgroundImage:'images/'+settings.countryCode+'/login_twitter.png'
	});
	contentView.add(twitterButton);*/
	
	var showUp=function(arg) {
		contentView.animate({top:-200,duration:500},function(e){
				contentView.top=-200;
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
		if (contentView.top==-200) {
			return;
		}
		showUp({id:e.source.id});
	};
	
	
	var adjustHeight= 60;
	var emailText = Titanium.UI.createTextField({
		id:'txtEmail',
		hintText : LL('app.your_email_address'),
		height : 50,
		top : 195+adjustHeight,		
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
		hintText : LL('profile.first_name'),
		height : 50,
		top : 245+adjustHeight,
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
		hintText : LL('profile.last_name'),
		height : 50,
		top : 245+adjustHeight,
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
		hintText : LL('profile.password'),
		height : 50,
		top : 292+adjustHeight,
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
	
	/********create pickerview 2012.3.30********/
	var transformPicker=Ti.UI.create2DMatrix();
	transformPicker=transformPicker.scale(0.5);
	var picker=Ti.UI.createPicker({
		top:75,
		width:570,
		height:10,
		transform:transformPicker
	});
	picker.selectionIndicator=true;
	contentView.add(picker);
	
	var pickerRow=Ti.UI.createPickerRow({title:LL('app.loading_data'),countryId:0,countryCode:''});
	picker.add(pickerRow);
	//remove all pickerRow 
	var removeAllPickerRows=function(picker) {
		var _col=picker.columns[0];
		var len=_col.rowCount;
		for (var x=len-1; x>=0; x--) {
			var _row=_col.rows[x];
			_col.removeRow(_row);
		}
		picker.reloadColumn(_col);
	}
	
	//process picker data
	var defaultSelectedIndex=0;
	var processData=function(datas) {		
		if (datas && datas.length>0){
			removeAllPickerRows(picker);
			for (var i=0;i<datas.length;i++) {
				var data=datas[i];
					var row=Ti.UI.createPickerRow({
					title:data.title,
					countryId:data.id,
					obj:{title:data.title,countryId:data.id,countryCode:data.domain}
				});
				picker.add(row);
				//set default selectedIndex
				if (Ti.App.Properties.getString("countryCode")){
					if (Ti.App.Properties.getString("countryCode")==data.domain) {
						defaultSelectedIndex=i;
					}
				}else if (settings.defaultCountry==data.domain){
					defaultSelectedIndex=i;
				}
				
				
			}//end for
			//picker.add(picker_data);
			picker.setSelectedRow(0,defaultSelectedIndex,false);
		}//end if
	}
	
	var categoryService=require("services/CategoryService");
	categoryService.getCountryList(processData);

	var registerButton = Ti.UI.createButton({		
		top:410,
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
		var pickerValue=picker.getSelectedRow(0).countryId;
		//alert(pickerValue);
		if (pickerValue<=0){
			Ti.App.fireEvent("app:message",{text:LL('app.country_cannot_be_empty')});
			return;
		}
		
		if (!emailText.value){
			Ti.App.fireEvent("app:message",{text:LL('app.email_cannot_be_empty')});
			emailText.focus();
			return;
		}
		if (!firstnameText.value){
			Ti.App.fireEvent("app:message",{text:LL('app.firstname_cannot_be_empty')});
			firstnameText.focus();
			return;
		}
		
		if (!lastnameText.value){
			Ti.App.fireEvent("app:message",{text:LL('app.lastname_cannot_be_empty')});
			lastnameText.focus();
			return;
		}
		if (!passwordText.value){
			Ti.App.fireEvent("app:message",{text:LL('app.password_cannot_be_empty')});
			passwordText.focus();
			return;
		}
		
		
		
		var userService = require("services/UserService");
		userService.register(emailText.value,passwordText.value,firstnameText.value,lastnameText.value,pickerValue,function(r){
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
	
	
	tableview.addEventListener("click",function(e){
		emailText.blur();
		firstnameText.blur();
		lastnameText.blur();
		passwordText.blur();
		showDown();
	});
	
	return self;
}
module.exports = winRegister;
