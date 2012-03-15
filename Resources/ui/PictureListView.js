var PictureListView=function(isLogin){
	var isLogin=isLogin;
	var self = Ti.UI.createWindow({		
		backgroundColor : '#fff',		
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:isLogin?false:true,
		fullscreen:false
	});
	
	if (!isLogin){
		var TopBarView = require("publicUI/TopBarView");
		var v = new TopBarView();
		self.add(v);
		var BottomLoginBar = require("publicUI/BottomLoginBar");
		var b = new BottomLoginBar();
		self.add(b);
	}else{
		var BackNavButton = require("publicUI/BackNavButton");
		new BackNavButton(self);
	}
	
	Ti.App.addEventListener("app:loginSuccess", function(e) {	
		self.close();
	});
	var categoryId = 0;
	var tag = "";
	var maxHeight = 100;
	var page = 0;
	var total = 100;
	var pages = 10;
	var ypos=[5,5,5];
	var list=[];
	var currentid=0;
	var key=""
	var scrollView = Ti.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',		
		top:isLogin?0:44,
		showVerticalScrollIndicator:true,
		verticalBounce :true
	});
	self.add(scrollView);

	var view = Ti.UI.createView({
		top:0,
		left:0,
		width:320,
		height:8000
	})
	scrollView.add(view);
	
	var lasty=0;			
	var isLoading=false;
	var isShow=true;
	var lastDir=0;
	var sequY=[0,0,0,0];
	var index =0;
	var scrollProcess = function(e) {
		if (e.y<0){
			return;
		}
		if (lasty>0){
			lasty++;
			if (lasty==6){
				lasty=0;
			}
			return;
		}else{
			lasty++;
		}
		sequY[index]=e.source.contentOffset.y;
		index++;
		if (index>=4){
			//Ti.API.info(sequY);
			index=0;
			if ((sequY[3]>sequY[2]) && (sequY[2]>sequY[1]) && (sequY[1]>sequY[0])){
				//Ti.API.info("Go Down...");
				if(isShow) {
					self.hideNavBar();
					Ti.App.fireEvent("app:tabgroup", {
						visible : false
					});
					isShow = false;
				}
			}
			if ((sequY[0]>sequY[1]) && (sequY[1]>sequY[2]) && (sequY[2]>sequY[3])){
				//Ti.API.info("Go up")
			
				if(!isShow) {
					if(isLogin) {
						self.showNavBar();
					}
					Ti.App.fireEvent("app:tabgroup", {
						visible : true
					});
					isShow = true;
				}

			}
		}
		
		/*
		var direction = e.y - lasty;
		Ti.API.info("direction="+direction+" lastDir="+lastDir);
		
		Ti.API.info(e);
		lastDir = direction;
		if(direction > 0) {
			if(e.y > 0) {
				if(isShow) {
					self.hideNavBar();
					Ti.App.fireEvent("app:tabgroup", {
						visible : false
					});
					isShow = false;
				}

			}
		} else {
			if(!isShow) {
				if(isLogin) {
					self.showNavBar();
				}
				Ti.App.fireEvent("app:tabgroup", {
					visible : true
				});
				isShow = true;
			}

		}
		lasty = e.y;
		*/
	}

	if (settings.showAnimation){
		scrollView.addEventListener("scroll",scrollProcess);
	}
	
	
	self.bottomGet=function(e){		
		if(e.y >= view.height /2) {
			//Ti.API.log("INFO", "i am in bottom");
			scrollView.removeEventListener("scroll", self.bottomGet);
			if (page<=pages){
				self.showData();	
			}
		}
	}
	self.showData=function(category,searchKey){
		if (category){				
			categoryId = category.id;
			key = searchKey;
		}
		
		isLoading =true;
		var categoryService = require("services/CategoryService");
		var processData = function(datas,isGet){
			scrollView.removeEventListener("scroll",scrollProcess);			
			var xpos=[5,110,215];
			list=list.concat(datas);
			for(var i=0;i<datas.length;i++){				
				var photo = datas[i];
				
				if(!photo.width) {
					photo.width = 100;
				}
				if(!photo.height) {
					photo.height = 100;
				}

				var x = xpos[i % 3];
				var y = ypos[i % 3];
				var h = photo.height * (100 / photo.width);

				
				var bgView = Ti.UI.createView({
					top : y,
					left : x,
					width : 100,
					height : h,
					backgroundColor:settings.defaultImageColor
				});
				var image = Ti.UI.createImageView({
					image : photo.url,
					width : 100,
					height : h,
					photoObj : photo,
					defaultImage:'images/clear.png'
				});
				ypos[i % 3] = ypos[i % 3] + h + 5;
				bgView.add(image);
				view.add(bgView);
				image.addEventListener("click", function(e) {	
					if (isLogin){
						Ti.App.fireEvent("app:imageClick",{id:e.source.photoObj.id,list:list,tab:"tabExplore"});
					}else{
						var PictureFullScreenView = require("publicUI/PictureFullScreenView");
						var picture = new PictureFullScreenView(e.source.photoObj.id,list,"");
						picture.open();		
					}
					
				});
			}
			
			var max = ypos[0];
			for(var i=0;i<ypos.length;i++) {
				var item = ypos[i];
				if(item > max)
					max = item;
			}
			view.height = max;
			maxHeight = max;
			scrollView.addEventListener("scroll", self.bottomGet);
			isLoading = false;
			if (isGet){
				page++;
			}
			scrollView.addEventListener("scroll",scrollProcess);
		};
		var offset = page*27+1;
		if (categoryId>0){
			categoryService.getCategory(categoryId,offset,processData);	
		}else{
			categoryService.searchByKey(key,offset,processData);
		}
				
	};
	
	return self;
};
module.exports = PictureListView;