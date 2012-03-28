var CustomTableView=function(parent,table_settings){
	var self = Titanium.UI.createTableView(table_settings);
	parent.add(self);
	var showDebug=false;
	var lastDistance = 0;
	var isShow = true;
	var lastY=0;
	self.updating=false;
	var scrollProcess=function(e) {
	
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		
		
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;
		
		
	
		if(distance < lastDistance) {
			var nearEnd = theEnd * .75;
			
			if((!self.updating) && (total >= nearEnd)) {
				if (parent.loadData){
					parent.loadData();
				}
				
			}
	
		}
		if (height==0){
			return;
		}
		var result = height+distance-theEnd;
		if (result==0){
			return;
		}
		if (showDebug){
			Ti.API.info(String.format("Line Data:  offsetY=%d,lastOffsetY=%d,sizeHeight=%d,contentSizeHeight=%d,distance=%d    -- result=%d",
													offset,lastY,height,theEnd,distance,result));
		}
		if (settings.showAnimation){
			
			if ((distance<=0) && (result<0)){
				//bottom
				if (isShow){
					parent.hideNavBar();
					customTabGroup.hide();
					isShow = false;
					if (showDebug)
						Ti.API.info(String.format("Down_bottom:offsetY=%d,lastOffsetY=%d,sizeHeight=%d,contentSizeHeight=%d,distance=%d",offset,lastY,height,theEnd,distance));
				}
				lastY= offset;
				return;
			}
			if ((offset<=0) && (result>0)){
				//top
				if (!isShow){
					parent.showNavBar();
					customTabGroup.show();
					isShow=true;
					if (showDebug)
						Ti.API.info(String.format("Up_top:  offsetY=%d,lastOffsetY=%d,sizeHeight=%d,contentSizeHeight=%d,distance=%d",offset,lastY,height,theEnd,distance));
				}
				lastY= offset;
				return;
			}
			if (offset>lastY){
				//go down;
				if (isShow){
					parent.hideNavBar();
					customTabGroup.hide();
					isShow = false;
					if (showDebug)
						Ti.API.info(String.format("Down:offsetY=%d,lastOffsetY=%d,sizeHeight=%d,contentSizeHeight=%d,distance=%d",offset,lastY,height,theEnd,distance));
				}
			}else{
				//go up
				if (!isShow){
					parent.showNavBar();
					customTabGroup.show();
					isShow=true;
					if (showDebug)
						Ti.API.info(String.format("Up:offsetY=%d,lastOffsetY=%d,sizeHeight=%d,contentSizeHeight=%d,distance=%d",offset,lastY,height,theEnd,distance));
				}
			}
			

		}
		lastY= offset;
		lastDistance = distance;
	}
	//self.addEventListener("scroll",scrollProcess);
	self.removeScrollListener=function(){
		self.removeEventListener("scroll",scrollProcess);
	}
	self.addScrollListener=function(){
		self.addEventListener("scroll",scrollProcess);
	}
	return self;
	
}
module.exports= CustomTableView;
