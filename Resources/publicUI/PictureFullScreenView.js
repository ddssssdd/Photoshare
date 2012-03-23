var PictureFullScreenView=function(photoid,list,tab){
	var self = Ti.UI.createWindow({
		backgroundColor:'#000',		
		barImage:"images/top_logo.png",
		fullscreen:false,
		tabBarHidden:true,
		navBarHidden:true
	});
	self.addEventListener("close",function(e){
		Ti.API.info("i am closed!");
		clearInterval(intervalId);
		
		
	})
	Ti.App.fireEvent("app:tabgroup",{visible:false});
	
	this.photoid = photoid;
	self.photo=null;
	this.pictureUrl = "";
	var image = null;
	var inProcess = true;
	
	var imageBg = Ti.UI.createView({
		width : 0,
		top : 0,
		left : 0,
		height : 0,
		backgroundColor : '#000'// settings.defaultImageColor
	});
	self.add(imageBg);


	var fillContent=function(f,isGet,delayTime){
		inProcess = false;
		if (!isGet){
			
			return;
		}else{
			
			for(var i = 0; i < list.length; i++) {
				if(list[i].id == f.photo.id) {
					if(!list[i].photoObj) {
						list[i].photoObj = f;

						break;
					}
				}
			}

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
		imageBg.photoid= f.photo.id;
		b.image = imageComing;
		b.fireEvent("bottom:update.photo",{photoUserId:f.userId,photoId:f.photo.id});
		imageBg.add(imageComing);
		imageComing.addEventListener("load",function(e){			
			if (imageComing.photo.id==imageBg.photoid){
				if (image){
					imageBg.remove(image);
					image=null;
				}
				
				//Ti.API.info("Image target :"+isLeft?320:-320);
				imageComing.animate({left:0,duration:500},function(){
					imageComing.left = 0;
				});
				image = imageComing;			
			}else{
				imageComming=null;
			}
		});
		imageComing.addEventListener("error",function(e){			
			Ti.UI.info("load image error");
		})
		
		
		
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
	var loadingList=[];
	var cacheLoad=function(newIndex){	
				
		if((newIndex < list.length) && (newIndex > -1)) {
			var obj=list[newIndex];
			if (loadingList.indexOf(obj.id)>-1){
				return;
			}
			if(!list[newIndex].isLoading) {
				Ti.API.info("loading...+",list[index].id);
				loadingList.push(list[newIndex]);
				categoryService.getPin(list[newIndex].id, function(e, isGet) {
					if(!isGet) {
						return;
					}
					Ti.API.info("Success loading: "+e.photo.id);
					var photoIndex =loadingList.indexOf(e.photo.id);
					if (photoIndex>-1){
						loadingList[photoIndex]=null;
					}
					for(var i = 0; i < list.length; i++) {
						if(list[i].id == e.photo.id) {
							if(!list[i].photoObj) {
								list[i].photoObj = e;
								
								break;
							}
						}
					}
				});
				;
				list[newIndex].isLoading = true;
			}
		}
	}
	
	var intervalId=setInterval(function(){
		if (!inProcess){
			Ti.API.info(" we can load something.")			
			cacheLoad(index+1);
			cacheLoad(index+2);
			cacheLoad(index-1);
			cacheLoad(index-2);
		
		}
	},1000);
	
	var isLeft=false;
	function disapearImage(callBackFunction){
	
		if(image) {
			image.animate({left:(isLeft?-1:1)*320,duration:500},function(){
				/*
				imageBg.remove(image);
				image = null;
				*/	
				if (callBackFunction){
					callBackFunction.call(this);
				}
			});
			
		}
		
	}
	function processNewImage(){		
		

		if(list[index].photoObj) {
			inProcess = true;
			disapearImage(function(){
				fillContent(list[index].photoObj, true);	
			});
			
		} else {
			if (list[index].isLoading){
				inProcess = true;
			}else{
				disapearImage();
				loadingList.push(list[index].id);
				list[index].isLoading = true;
				categoryService.getPin(list[index].id, fillContent);
				inProcess = true;
			}
			
		}
	}
	var isSwipe = false;
	self.addEventListener("swipe",function(e){
		if (inProcess){
			return;
		}
		isSwipe = true;
		
		Ti.API.info("swipe happened...............");
		if (e.direction=="left"){
			//next
			isLeft=true;
			index =index +1;
			if ((index<list.length) && (index>-1)){
				//show next;
				processNewImage();
					
			}else{
				index = list.length-1;
				Ti.App.fireEvent("app:message",{text:L('no_more_pictures')});
			}
		}else if (e.direction=="right"){
			isLeft=false;
			index = index - 1;
			if ((index<list.length) && (index>-1)){
				//show proior
				processNewImage();
				
			}else{
				index = 0;
				Ti.App.fireEvent("app:message",{text:L('no_more_pictures')});
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
		clearInterval(intervalId);
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
			
			infoLabelright.text = e.pin.likeCount+L('likes')+ " "+e.pin.repinCount+L('repins');	
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
		Ti.API.info("click happened...............");
		setTimeout(function(e){
			if (isSwipe){
				isSwipe = false;
				return;
			}
			if(isClose) {
				return;
			}
			if (inProcess){
				return;
			}
			Ti.API.info("click handled ...............");
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
