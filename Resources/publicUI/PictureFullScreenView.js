var PictureFullScreenView=function(photoid,list,tab){
	var self = Ti.UI.createWindow({
		backgroundColor:'#000',		
		barImage:"images/top_logo.png",
		fullscreen:false,
		tabBarHidden:true,
		navBarHidden:true
	});
	Ti.App.fireEvent("app:tabgroup",{visible:false});
	
	this.photoid = photoid;
	self.photo=null;
	this.pictureUrl = "";
	var image = null;
	var inProcess = false;
	
	var imageBg = Ti.UI.createView({
		width : 0,
		top : 0,
		left : 0,
		height : 0,
		backgroundColor : '#000'// settings.defaultImageColor
	});
	self.add(imageBg);


	var fillContent=function(f,isGet){
		inProcess = false;
		if (!isGet){
			return;
		}
		self.photo =f.photo;
		this.photoid = f.photo.id;
		
		
		var h = (f.photo.height?f.photo.height:100) * 320 / (f.photo.width?f.photo.width:100);
		var t = (h >= 480) ? 0 : (480 - h) / 2;
		var imageComing = Ti.UI.createImageView({
			image : f.photo.url,
			width : 320,
			top : 0,
			left : isLeft?320:-320,
			height : h,
			photo:self.photo,
			defaultImage:'images/clear.png'
		});
		imageBg.top = t;
		imageBg.left = 0;
		imageBg.width = 320,
		imageBg.height = h;			
		imageBg.zIndex = 0;
		
		imageBg.add(imageComing);
		imageComing.addEventListener("load",function(e){
			
			imageComing.animate({left:0,duration:500},function(){
				imageComing.left = 0;
			})
			//imageBg.animate({view:imageComing,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
			
			/*
			if (image){
				imageBg.animate({view:imageComing,transition:Ti.UI.iPhone.AnimationStyle.CURL_DOWN});	
				imageBg.remove(image);
				image = null;
			}
			*/
			image = imageComing;
			b.image = image;
			
			b.fireEvent("bottom:update.photo",{photoUserId:f.userId,photoId:f.photo.id});
		});
		
		infoLabel2.text = f.firstname+" "+f.lastname;
		infoLabel.text = f.photo.description;
		infoLabelright.text = f.photo.likeCount+(f.photo.likeCount>1?" Likes ":" Like ")+f.photo.repinCount+(f.photo.repinCount>1?" Repins":" Repin");
		boardLabel.text = f.photo.board;
		boardLabel.bid= f.photo.boardId;
		//userInfo missing user.id
		boardLabel.userInfo={avater:f.source.avatar,lastName:f.source.lastName,firstName:f.source.firstName};
		
	}
	Ti.App.addEventListener("app:deletePin",function(e){
		self.close();	
	});
	var categoryService = require("services/CategoryService");
	categoryService.getPin(this.photoid,fillContent);
	var index=-1;
	for(var i=0;i<list.length;i++){
		if (this.photoid==list[i].id){
			index = i;
			break;
		}
	}
	var isLeft=false;
	function disapearImage(pisLeft){
		isLeft = pisLeft;
		if(image) {
			/*
			imageBg.animate({
				view : image,
				transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
			*/
			
			image.animate({left:(isLeft?-1:1)*320,duration:500},function(){
				imageBg.remove(image);
				image = null;	
			});
			
		}
		
	}
	
	self.addEventListener("swipe",function(e){
		if (inProcess)
			return;
		
		if (e.direction=="left"){
			//next
			index =index +1;
			if ((index<list.length) && (index>-1)){
				//show next;
				b.visible = false;
				t.visible = false;
				categoryService.getPin(list[index].id,fillContent);
				disapearImage(true);
				inProcess = true;
					
			}else{
				index = list.length-1;
				Ti.App.fireEvent("app:message",{text:'No more pictures'});
			}
		}else if (e.direction=="right"){
			index = index - 1;
			if ((index<list.length) && (index>-1)){
				//show proior
				b.visible = false;
				t.visible = false;
				categoryService.getPin(list[index].id,fillContent);
				disapearImage(false);
				inProcess = true;
			}else{
				index = 0;
				Ti.App.fireEvent("app:message",{text:'No more pictures'});
			}
		}
	})
	
	
	self.showLayer = false;
	var flatLayer = Ti.UI.createView({
			backgroundColor:'#808080',
			opacity:0.75,
			width:320,
			height:40,
			bottom:47
	});
	
	var TopBarView = require("publicUI/TopBarView");
	var t = new TopBarView();
	self.add(t);
	t.backgroundImage = 'images/top_bg.png';
	var isClose = false;
	t.addBackButton(function(e){
		isClose = true;
		self.close();
		customTabGroup.show();
	});
	t.visible = false;
	var b=null;
	if (tab){
		var BottomToolBar = require("publicUI/BottomToolBar");
		b= new BottomToolBar();
	}else{
		var BottomLoginBar= require("publicUI/BottomLoginBar");
		b = new BottomLoginBar();
	}
	self.add(b);
	b.tabName = tab;
	b.visible = false;
	var boardLabel = Ti.UI.createLabel({
		text:"",
		top:6,
		right:10,
		height: 30,
		font:{fontSize:14,fontWeight:"bold"},
		width:200,
		color:'#fff',
		bid:0,		
		userInfo:null,
		textAlign:"right"
	});
	t.add(boardLabel);
	boardLabel.addEventListener("click",function(e){
		if (!tab){
			return;
		}
		if (boardLabel.bid>0){
						
			Ti.App.fireEvent("app:openInTab",{userInfo:boardLabel.userInfo,tab:tab,id:boardLabel.bid});
			
		}
	})
	Ti.App.addEventListener("app:loginSuccess", function(e) {	
		self.close();
	});
	Ti.App.addEventListener("app:refresh.pin",function(e){
		//alert(e);
		if (e.pin.status=="success"){
			
			infoLabelright.text = e.pin.likeCount+" likes "+e.pin.repinCount+" repins";	
		}
		
	});
	var infoLabel = Ti.UI.createLabel({
		text:"",
		top:15,
		left:10,
		width:200,
		height:25,
		font:{fontSize:12,fontWeight:"bold"}
	});
	flatLayer.add(infoLabel);
	var infoLabelright = Ti.UI.createLabel({
		text:"",
		top:0,
		right:10,
		width:100,
		font:{fontSize:10,fontWeight:"bold"},
		textAlign:'right'
	});
	flatLayer.add(infoLabelright);
	var infoLabel2 = Ti.UI.createLabel({
		text:"",
		top:0,
		left:10,
		height:25,
		font:{fontSize:12}
	});
	flatLayer.add(infoLabel2);
	
	self.add(flatLayer);
	self.addEventListener("click",function(e){
		setTimeout(function(e){
			
			if(isClose) {
				return;
			}
			if (inProcess){
				return;
			}
			self.showLayer = !self.showLayer;
			if(self.showLayer) {
				flatLayer.show();
				/*
				 flatLayer.visible = false;
				 flatLayer.opacity = 0;

				 flatLayer.visible = self.showLayer;
				 flatLayer.animate({
				 opacity : 0.75,
				 duration : 500
				 }, function() {
				 flatLayer.opacity = 0.75;
				 });
				 */
				t.visible = true;
				b.visible = true;
				Titanium.App.fireEvent("app:tabgroup", {
					visible : true,
					isBottomTool : true
				});

			} else {
				/*
				 flatLayer.opacity = 0.75;

				 flatLayer.animate({opacity:0,duration:500},function(){
				 flatLayer.opacity = 0;
				 flatLayer.visible = self.showLayer;
				 });
				 */
				t.visible = false;
				b.visible = false;
				flatLayer.hide();
				Titanium.App.fireEvent("app:tabgroup", {
					visible : false,
					isBottomTool : true
				});
			}

		},200);
		
		
	});
	flatLayer.visible = self.showLayer;
	
	flatLayer.zIndex=10;	
	return self;
	
}

module.exports = PictureFullScreenView;