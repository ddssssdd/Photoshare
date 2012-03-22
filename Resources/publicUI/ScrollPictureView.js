var ScrollPictureView=function(datas,parent,tabName){
	this.tabName = tabName;
	this.max=0;
	var ypos=[10,10,10];
	
	var xpos = [5, 110, 215];
	for(var i = 0; i < datas.length; i++) {
		var photo = datas[i];
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
			photoId : photo.id,
			defaultImage:'images/clear.png'
		});
		ypos[i % 3] = ypos[i % 3] + h + 5;
		bgView.add(image);
		parent.add(bgView);
		//view.add(image);

		image.addEventListener("click", function(e) {
			Ti.App.fireEvent("app:imageClick", {
				id : e.source.photoId,list:datas,tab:tabName
			});
		});
	}

	var max = ypos[0];
	for(var i = 0; i < ypos.length; i++) {
		var item = ypos[i];
		if(item > max)
			max = item;
	}
	parent.height = max;
	this.max=max;

}

module.exports= ScrollPictureView;
