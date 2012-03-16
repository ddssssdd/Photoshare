var PictureView=function(photo,list){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',		
		barImage:"images/top_logo.png"
	});
	this.pictureUrl = "";
	
	var scrollView = Ti.UI.createScrollView({
		width:320,
		height:1000,
		contentWidth:'320',
		contentHeight:'auto',
		top:0,
		showVerticalScrollIndicator:true,
		verticalBounce :true
	});
	self.add(scrollView);
	var inProcess = false;
	var fillContent=function(f){
		
		if ((scrollView.children) && (scrollView.children.length>0)){
			scrollView.remove(scrollView.children[0]);
		}
		var PicturePartView = require("ui/PicturePartview");
		var pview = new PicturePartView(f.avater,f.lastname+" "+f.firstname,f.photo,self);
		pview.height = 1500;
		scrollView.add(pview);
		inProcess = false;
		
	}
	var categoryService = require("services/CategoryService");
	categoryService.getPin(photo,fillContent);
	var index=-1;
	for(var i=0;i<list.length;i++){
		if (photo==list[i].id){
			index = i;
			break;
		}
	}
	//alert(index);
	
	scrollView.addEventListener("swipe",function(e){
		if (inProcess)
			return;
		inProcess = true;
		if (e.direction=="left"){
			//next
			index =index +1;
			if ((index<list.length) && (index>-1)){
				//show next;
				categoryService.getPin(list[index].id,fillContent);
			}
		}else if (e.direction=="right"){
			index = index - 1;
			if ((index<list.length) && (index>-1)){
				//show proior
				categoryService.getPin(list[index].id,fillContent);
			}
		}
	})
	
	/*
	var contentView = Ti.UI.createView({
		top:0,
		left:0,
		width:320,
		height:1000
	});
	scrollView.add(contentView);
	
	var viewTop = Ti.UI.createView({
		top:0,
		left:0,
		height: 50
	});
	contentView.add(viewTop);
	
	var imageUser = Ti.UI.createImageView({
		top:20,
		left:20,
		width:30,
		height:30
	});
	viewTop.add(imageUser);
	
	var labelTop = Ti.UI.createLabel({
		top:20,
		left: 70,
		height: 30,
		text: photo.source.user.id
	})
	viewTop.add(labelTop);
	
	var h = 310 / (photo.width / photo.height);
	var image = Ti.UI.createImageView({
		top:55,
		image:photo.url,
		width: 310,
		height: h
	});
	contentView.add(image);
	
	var labelCreate = Ti.UI.createLabel({
		top: 55+h,
		left:20,
		height: 50,
		text:photo.source.dateCreated
	})
	contentView.add(labelCreate);
	
	var labelUpdate = Ti.UI.createLabel({
		top: 105+h,
		left:20,
		height: 50,
		text:photo.source.lastUpdated
	})
	contentView.add(labelUpdate);
	
	var repinButton = Ti.UI.createButton({
		title:'Repin',
		top: 155+h,
		left: 20,
		width: 80,
		height: 30
	});
	repinButton.addEventListener("click",function(e){
		Ti.App.fireEvent("App:repin",{photo:photo});
	})
	contentView.add(repinButton);
	
	var likeButton = Ti.UI.createButton({
		title:'Like',
		top: 155+h,
		left: 110,
		width: 80,
		height: 30
	});
	likeButton.addEventListener("click",function(e){
		Ti.App.fireEvent("App:like",{photo:photo});
	})
	contentView.add(likeButton);
	
	var moreButton = Ti.UI.createButton({
		title:'More...',
		top: 155+h,
		right: 20,
		width: 80,
		height: 30
	});
	moreButton.addEventListener("click",function(e){
		Ti.App.fireEvent("App:more",{photo:photo});
	})
	contentView.add(moreButton);
	*/
	return self;
};
module.exports = PictureView;
