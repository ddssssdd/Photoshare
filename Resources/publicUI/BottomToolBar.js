var BottomToolBar=function(topValue){
	var self;
	if (topValue){
		self = Titanium.UI.createView({
			top : topValue,
			left : 0,
			width : 320,			
			height : 47,
			//backgroundImage : 'images/bottom_bg.png',
			zIndex : 11
		});
	} else{		
		self = Titanium.UI.createView({
			bottom : 0,
			left : 0,
			width : 320,
			height : 47,
			backgroundImage : 'images/bottom_bg.png',
			zIndex : 11,
			isShowing:true
		});
	}
	 
	self.image = null;
	self.tabName=null;
	self.tab = null;
	
	var repinBtn = Ti.UI.createButton({
		left:10,
		height:31,
		width:77,
		backgroundImage:"images/repin_button.png"
	})
	
	var likeBtn = Ti.UI.createButton({
		left:100,
		height:31,
		width:65,
		backgroundImage:"images/like_button.png",
		action:"like"
	});
	var moreBtn = Ti.UI.createButton({
		right:10,
		height:31,
		width:61,
		backgroundImage:"images/more_button.png"
	});
	self.add(repinBtn);
	self.add(likeBtn);
	self.add(moreBtn);
	repinBtn.addEventListener("click",function(e){
		Ti.App.fireEvent("app:repin",{photo:self.image.photo,tab:self.tabName});
		
	});
	likeBtn.addEventListener("click",function(e){
		var userService = require("services/UserService");
		if (likeBtn.action=="delete"){
			userService.deletePin(self.image.photo.id, function(e) {
				//alert(e);
				Ti.App.fireEvent("app:deletePin",{pinId:self.image.photo.id,rowindex:likeBtn.rowindex});
			});
		}else{
			userService.like(self.image.photo.id, function(e) {
				if(e.status == "success") {
					Ti.App.fireEvent("app:refresh.pin", {
						pin : e
					});
					Ti.App.fireEvent("app:message", {
						text : "Like success!"
					});
					likeBtn.backgroundImage = "images/" + e.text + "_button.png";
				} else {
					Ti.App.fireEvent("app:message", {
						text : "like failure:" + e.memo
					});
				}

			});
		}
				
	});
	self.addEventListener("bottom:update.photo",function(e){
		if (e.photoId!=self.image.photo.id){
			return;
		}
		var userService = require("services/UserService");
		if (userService.user.id==e.photoUserId){
			likeBtn.backgroundImage ="images/delete_button.png";
			likeBtn.action="delete";
			likeBtn.rowindex= e.rowIndex;
		}
	});
	moreBtn.addEventListener("click",function(e){

		var moreOption = Ti.UI.createOptionDialog({
			options : ['Comment', 'Email pin', 'Save to Camera Roll', 'Cancel'],
			cancel : 3,
			destructive:3
		});
		moreOption.show();
		moreOption.addEventListener("click", function(e) {
			if(e.index == 0) {
				var winComments = require("ui/winComments");
				var w = new winComments(self.image.photo);
				if (self.tab){
					self.tab.open(w);	
				}else{
					self.parent.tab.open(w);
				}				
			}
			if (e.index==1){
				
				var emailDialog = Titanium.UI.createEmailDialog();
				if(!emailDialog.isSupported()) {
					Ti.UI.createAlertDialog({
						title : 'Error',
						message : 'Email not available'
					}).show();
					return;
				}
				emailDialog.setSubject('From Pinspire');
				emailDialog.setToRecipients(['']);
				emailDialog.setCcRecipients(['']);
				//emailDialog.setBccRecipients(['']);

				if(Ti.Platform.name == 'iPhone OS') {
					emailDialog.setMessageBody('<b>Pin From Pinspire!</b>');
					emailDialog.setHtml(true);
					emailDialog.setBarColor('#336699');
				} else {
					emailDialog.setMessageBody('Pin From Pinspire!');
				}

				// attach a blob
				emailDialog.addAttachment(self.image.toBlob());

				

				emailDialog.addEventListener('complete', function(e) {
					if(e.result == emailDialog.SENT) {
						if(Ti.Platform.osname != 'android') {
							Ti.App.fireEvent("app:message",{text:"Message was sent"});
							
						}
					} else {
						Ti.App.fireEvent("app:message",{text:"Message was not sent."});
						
					}
				});
				emailDialog.open();


			}
			if(e.index == 2) {
				Titanium.Media.saveToPhotoGallery(self.image.toBlob());
				Ti.App.fireEvent("app:message", {
					text : "Save image to Photo Gallery."
				});
			}
		});


	});
	Titanium.App.addEventListener("app:tabgroup",function(e){
		if (e.isBottomTool){
		
			if(e.visible) {
				self.show();
				return;
				self.visible = true;
				
				self.bottom = -50;
				self.animate({
					bottom : 0,
					duration : 500
				}, function() {
					self.bottom = 0;
				})
			} else {
				self.hide();
				return;
				self.visible = false;
				
				self.bottom = 0;
				self.animate({
					bottom : -50,
					duration : 500
				}, function() {
					self.bottom = -50;
				});
				
			}
	
		}
		
	})
	return self;
	
}
module.exports = BottomToolBar;
