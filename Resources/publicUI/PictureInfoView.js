var PictureInfoView=function(photo){
	var contentView = Ti.UI.createView();
	var labelCreate = Ti.UI.createLabel({
		top: 5,
		left:20,
		height: 50,
		text:photo.description,
		font:{fontFamily:'Arial',fontSize:16,fontWeight:'bold'}
	});
	contentView.add(labelCreate);
	
	var labelUpdate = Ti.UI.createLabel({
		top: 55,
		left:20,
		height: 50,
		text: "12 minutes ago from " + photo.website,
		color:'#878787',
		font:{fontFamily:'Helvetica Neue',fontSize:16,fontWeight:'bold'},
		url:photo.website
	});
	labelUpdate.addEventListener("click",function(e){
		Ti.App.fireEvent("app:openUrl",{url:e.source.url});
	});
	contentView.add(labelUpdate);
	
	var repinButton = Ti.UI.createButton({
		title:'Repin',
		top: 105,
		left: 20,
		width: 80,
		height: 30,
		image:"a003.png"
	});
	repinButton.addEventListener("click",function(e){
		Ti.App.fireEvent("app:repin",{photo:photo});
	})
	contentView.add(repinButton);
	
	var likeButton = Ti.UI.createButton({
		title:'Like',
		top: 105,
		left: 110,
		width: 80,
		height: 30,
		image:"a002.png"
	});
	likeButton.addEventListener("click",function(e){
		Ti.App.fireEvent("app:like",{photo:photo});
	})
	contentView.add(likeButton);
	
	var moreButton = Ti.UI.createButton({
		title:'More...',
		top: 105,
		right: 20,
		width: 80,
		height: 30
	});
	moreButton.addEventListener("click",function(e){
		Ti.App.fireEvent("app:more",{photo:photo});
	})
	contentView.add(moreButton);
	var iconRepin = Ti.UI.createImageView({
		top: 145,
		left:20,
		width:15,
		height:15,
		image:"a003.png"
	});
	contentView.add(iconRepin);
	var lblRepin = Ti.UI.createLabel({
		top:145,
		left:50,
		height:30,
		text : photo.repinCount
	});
	contentView.add(lblRepin);
	var iconLike = Ti.UI.createImageView({
		top: 155,
		left:20,	
		width:15,
		height:15,	
		image:"a002.png"
	});
	contentView.add(iconLike);
	var lblLike = Ti.UI.createLabel({
		top:155,
		left:50,
		height:30,
		text : photo.likeCount
	});
	contentView.add(lblLike);
	return contentView;
}
module.exports = PictureInfoView;
