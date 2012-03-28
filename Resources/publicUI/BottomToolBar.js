var BottomToolBar=function(topValue,photo){
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
	
	
	/*************show like or unlike *******************/
	var userService = require("services/UserService");
	userService.getLikes(userService.user.id,0,function(e){
		var datas=e;
		for (var i=0;i<datas.length;i++) {
			if (datas[i].id==photo.id) {
				Ti.API.info('they are the same');
				likeBtn.backgroundImage="images/unlike_button.png";
				//likeBtn.action='delete';
				break;
			}
		}
	});
	
	
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
		var isUnlike=e.source.backgroundImage.indexOf('unlike_button.png')!=-1; //according to the image src to judge
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
					
					//send message to update profile likecount 2012.3.28
					Ti.App.fireEvent('app:updateProfile',{like:((isUnlike) ? -1 :1) });
					
					Ti.App.fireEvent("app:message", {
						text : (isUnlike)? L('unlike_success') : L('like_success')
					});
					likeBtn.backgroundImage = "images/" + e.text + "_button.png";
				} else {
					Ti.App.fireEvent("app:message", {
						text : L('like_failure') + e.memo
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
			options : [L('comment'), L('email_pin'), L('save_to_camera'), L('cancel')],
			cancel : 3,
			destructive:3
		});
		moreOption.show();
		moreOption.addEventListener("click", function(e) {
			if(e.index == 0) {
				var winComments = require("ui/winComments");
				var w = new winComments(self.image.photo);
				tabGroup.activeTab.open(w);
				/*
				if (self.tab){
					self.tab.open(w);	
				}else{
					self.parent.tab.open(w);
				}
				*/				
			}
			if (e.index==1){
				
				var emailDialog = Titanium.UI.createEmailDialog();
				if(!emailDialog.isSupported()) {
					Ti.UI.createAlertDialog({
						title : L('error'),
						message : L('email_not_available')
					}).show();
					return;
				}
				emailDialog.setSubject(L('from_pinspire'));
				emailDialog.setToRecipients(['']);
				emailDialog.setCcRecipients(['']);
				//emailDialog.setBccRecipients(['']);

				if(Ti.Platform.name == 'iPhone OS') {
					emailDialog.setMessageBody('<b>'+L('pin_from_pinspire')+'</b>');
					emailDialog.setHtml(true);
					emailDialog.setBarColor('#336699');
				} else {
					emailDialog.setMessageBody(L('pin_from_pinspire'));
				}

				// attach a blob
				emailDialog.addAttachment(self.image.toBlob());

				

				emailDialog.addEventListener('complete', function(e) {
					if(e.result == emailDialog.SENT) {
						if(Ti.Platform.osname != 'android') {
							Ti.App.fireEvent("app:message",{text:L('message_was_sent')});
							
						}
					} else {
						Ti.App.fireEvent("app:message",{text:L('message_was_not_sent')});
						
					}
				});
				emailDialog.open();


			}
			if(e.index == 2) {
				Titanium.Media.saveToPhotoGallery(self.image.toBlob());
				Ti.App.fireEvent("app:message", {
					text : L('save_image_to_photo_gallery')
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
