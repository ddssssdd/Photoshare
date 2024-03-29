var TopBarView = function(){
	var self = Titanium.UI.createView({
		top:0,
		left:0,
		width:320,
		height:44,
		backgroundImage:'images/top_logo.png',
		zIndex:10,
		isShowing:true,
		inAnimation:false
	});	
	
	self.addLeftNavButton=function(btn,callBackFunction) {
		btn.top=8, btn.left=10, btn.height=28;
		self.add(btn);
		btn.addEventListener('click',function(e){
			callBackFunction.call(this,e);
		});
	};
	
	self.addRightNavButton=function(btn,callBackFunction) {
		btn.top=8, btn.right=10, btn.height=28;
		self.add(btn);
		btn.addEventListener('click',function(e){
			callBackFunction.call(this,e);
		})
	}
		
	self.addBackButton = function(callBackFunction) {
		var backBtn = Ti.UI.createButton({
			top : 8,
			left : 10,
			height : 28,
			width : 62,
			backgroundImage : "images/back.png"
		});
		self.add(backBtn);
		backBtn.addEventListener("click", function(e) {
			callBackFunction.call(this, e);
		});
	}
	self.showTop=function(v,isHot){
		if (isHot) {
			self.inAnimation = true;
			self.visible = true;
			self.top=0;
			return;
		}
		if (self.inAnimation){
			return;
		}
		if (v){
			
			if (self.top==0){
				return;
			}
			if (self.isShowing){
				return;
			}
			self.inAnimation = true;
			self.visible = true;
			
			self.top = -50;
			self.animate({top:0,duration:500},function(){
				self.top = 0;
				self.inAnimation = false;
			});
			self.isShowing = true;
			
		}else{			
			if (self.top==-50){
				return;
			}
			if (!self.isShowing){
				return;
			}
			self.inAnimation = true;
			self.top = 0;
			self.animate({top:-50,duration:500},function(){
				self.top = -50;
				self.inAnimation=false;
							
			});
			self.isShowing = false;
			self.visible = false;
		}
	}
	
	Titanium.App.addEventListener("app:tabgroup",function(e){
		self.showTop(e.visible);
	});

	
	return self;
}


module.exports = TopBarView;
