var BackNavButton=function(win,callBackFunction){
	
	var self = Ti.UI.createButton({
		top : 5,
		left : 10,
		height : 28,
		width : 64,
		backgroundImage :settings.getImageFile('back.png')
	});
	win.leftNavButton = self;
	self.addEventListener("click", function(e) {
		if (callBackFunction){
			callBackFunction.call(this);
		}else{
			win.close();
		}		
	});
	return self;
}
module.exports = BackNavButton;
