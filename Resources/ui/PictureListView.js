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
		
		/***********add two button*************/
		var leftButton=Ti.UI.createButton({
			title:'Category',
			width:28,
			backgroundImage:'images/category.png'
		});
		v.addLeftNavButton(leftButton,function(e){
			var winCategory=require('ui/winCategory');
			new winCategory().open();
		})
		var rightButton=Ti.UI.createButton({
			title:'Select Country',
			width:28,
			backgroundImage:'images/country.png'
		});
		v.addRightNavButton(rightButton,function(e){
			//TODO
			var winCountry=require('ui/winCountry');
			new winCountry().open();
		});
		
		
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
	
	/************create tableview ***********************/
	var tbl_data=[];
	var CustomTableView = require("publicUI/CustomTableView");
	var tableView = new CustomTableView(self);
	if (isLogin){
		tableView.top=0;
	}else{
		tableView.top=44;	
	}
	tableView.selectionStyle=Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;	
	self.add(tableView);
	tableView.addScrollListener();
	
	var isRefresh=false;
	/***********pull refresh component*******************/
	var tableHeader=require('publicUI/TableViewPullRefresh');
	new tableHeader(tableView,function(e){
		page = 0;
		ypos=[5,5,5];
		list=[];
		Ti.API.info('pull refresh load data');
		isRefresh=true; //flag
		tableView.deleteRow(0);
		tableView.data =[];
		view = Ti.UI.createView({
			top : 0,
			left : 0,
			width : 320,
			height : 600
		})

		//add the scrollview to tableview first row 2012.3.30
		//tableView.height = maxHeight;
		newrow = Ti.UI.createTableViewRow({
			height : 'auto'
		});
		newrow.add(view);
		tableView.data = [newrow];


		self.loadData();
	});
	
	
	self.loadData=function(){
		self.showData();
	}
	
	
	
	var view = Ti.UI.createView({
		top:0,
		left:0,
		width:320,
		height:600
	})
	
	//add the scrollview to tableview first row 2012.3.30
	//tableView.height = maxHeight;
	var newrow = Ti.UI.createTableViewRow({
		height : 'auto'
	});
	newrow.add(view);
	tableView.data = [newrow];
		//add empty row

	var lasty=0;			
	var isLoading=false;
	var isShow=true;
	var lastDir=0;
	var sequY=[0,0,0,0];
	var index =0;
	var scrollProcess = function(e) {
		if (!settings.showAnimation){
			return;
		}
		//Ti.API.info(String.format("e.y=%d,e.size.height=%d",e.y,e.source.size.height));
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
		
		
	}

	
	
	
	self.bottomGet=function(e){		
		if(e.y >= view.height /2) {
			//Ti.API.log("INFO", "i am in bottom");
			//scrollView.removeEventListener("scroll", self.bottomGet);
			if (page<=pages){
				//self.showData();	
			}
		}
	}
	var starty=0;
	var endy=0;
	
	self.showData=function(category,searchKey){
		//tableView.addScrollListener();
		tableView.removeScrollListener();
		if (category){				
			categoryId = category.id;
			key = searchKey;
		}
		
		isLoading =true;
		var categoryService = require("services/CategoryService");
		var processData = function(datas,isGet){
			//scrollView.removeEventListener("scroll",scrollProcess);			
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
			newrow.height = max;
			maxHeight = max;
			//scrollView.addEventListener("scroll", self.bottomGet);
			isLoading = false;
			if (isGet){
				page++;
			}
			tableView.addScrollListener();
			
		};//end processData
		var offset = page*27+1;
		if (categoryId>-1){
			categoryService.getCategory(categoryId,offset,processData);	
		}else{
			categoryService.searchByKey(key,offset,processData);
		}
	
	};//end showdata
	
	
	
	Ti.App.addEventListener('app:reload',function(e){
		page = 0;
		ypos=[5,5,5];
		self.loadData();
	});

	return self;
};
module.exports = PictureListView;
