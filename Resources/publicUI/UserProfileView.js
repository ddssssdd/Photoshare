var UserProfileView=function(user,tabName){
	/*
	  
	 id
	  "avatar":"771184.995893536483566E7.JPEG",
      "firstName":"yu",
      "lastName":"kai",
      "email":"fish_king_k@163.com",
      "board_count":6,
      "comment_count":6,
      "followed_count":1,
      "following_count":17,
      "like_count":3,
      "pin_count":3,
      "repin_count":3
				 * */
	this.user = user;
	this.tabName = tabName;
	var userId = user.id;
	var bgView = Ti.UI.createScrollView({
		top:0,
		left:0,
		width:320,
		contentHeight:'auto'
	});
	var self = Ti.UI.createView({
		top:0,
		left:0,
		width:320,
		height:'auto'
	});
	bgView.add(self);
	
	
	self.addEventListener("singletap",function(e){
		Ti.API.info(e);
	});
	self.addEventListener("touchend",function(e){
		Ti.API.info(e);
	});
	var view = Ti.UI.createView({
		top : 0,
		width : 320,
		height : 90
	});
	var imageBg= Ti.UI.createView({
		top:10,
		left:10,
		width:70,
		height:70,
		backgroundColor:settings.defaultImageColor
	});
		
	//user.avatar 
	var image = Ti.UI.createImageView({
		image : user.avatar,//"http://c707237.r37.cf3.rackcdn.com/1479724.328142005595554E7_small_u.JPEG",//"http://beta.pinspire.com.hk/images/avatar-default.jpg",
		width : 70,
		height : 70,
		top : 10,
		left : 10,
		defaultImage:'images/clear.png'
	});
	view.add(imageBg);
	view.add(image);
	var labelUser = Ti.UI.createLabel({
		text : user.firstName+ " "+user.lastName,
		font : {
			fontFamily : 'Arial',//'Helvetica Neue',
			fontSize : 18,
			fontWeight:"bold"
		},
		left : 90,
		top:-30
	})
	view.add(labelUser);

	self.add(view);
	
	view.addEventListener("click",function(e){
		if (toolBar){
			toolBar.labels[0]= "3 Collections";
		}
	})
	
	
	var followersCount = Ti.UI.createLabel({
		top:50,
		left:90,
		width:'auto',
		height:30,
		font:{fontSize:12,fontWeight:"bold"},
		//backgroundImage:"images/follow_number_bg_left.png",		
		text: user.followed_count,
		textAlign:"center"
	});
	self.add(followersCount);
	
	var followersLabel = Ti.UI.createLabel({
		top:50,
		left:followersCount.left+followersCount.width,
		width:'auto',
		height:30,
		font:{fontSize:14},
		//backgroundImage:"images/follow_bg_left.png",
		text:(user.followed_count>1? L('followers') : L('follower') )
	});
	self.add(followersLabel);
	
	var followingsCount = Ti.UI.createLabel({
		top:50,
		left: followersLabel.left+followersLabel.width+15,
		width:'auto',
		height:30,
		font:{fontSize:12,fontWeight:"bold"},
		//backgroundImage:"images/follow_number_bg_left.png",
		text: user.following_count
	});
	self.add(followingsCount);
	var followingsLabel = Ti.UI.createLabel({
		top:50,
		left:followingsCount.left+followingsCount.width,
		width:'auto',
		height:30,
		font:{fontSize:14},
		//backgroundImage:"images/follow_bg_left.png",
		text:(user.folowing_count>1? L('followings') : L('following') )
	});
	self.add(followingsLabel);
	
	
	
	
	
	var bottomView;
	var createContent=function(){
		if (bottomView){
			self.remove(bottomView);
		}		
		bottomView = Ti.UI.createView({
			top : 120,
			left : 0,
			width : 320,
			//height:'auto'
			height:800
		})
		self.add(bottomView);	
	}
	var loadBoards=function(datas){
		var tableView = Ti.UI.createTableView({
			top:5,
			left:0
		});
		if (toolBar){
			toolBar.labels[0]= datas.length+(datas.length>1? L('collections') : L('collection') );
		}
		bottomView.add(tableView);
		var tbl_data = [];
		var h=0;
		for(var i=0;i<datas.length;i++){
			
			var item = datas[i];
			var row = Ti.UI.createTableViewRow({hasChild:true});
			var label = Ti.UI.createLabel({
				text:item.title.length>30 ? item.title.length.substring(0,30)+"..." :item.title , // if the title length more than 30 then substring
				top:-10,
				left:10,
				font:{fontSize:13,fontWeight:"bold"}
			});
			row.board = item;
			row.add(label);
			var info =item.pins+(item.pins>1? L('pins') : L('pin') )+" "+item.followers+(item.followers>1? L('followers') : L('follower') );
			var label2 = Ti.UI.createLabel({
				text:info,
				top:15,
				left:10,
				font:{fontSize:10}
			});
			row.add(label2);
			h += row.height;
			tbl_data.push(row);
		}
		tableView.data = tbl_data;
		tableView.addEventListener("click",function(e){
		
			Ti.App.fireEvent("app:openInTab",{id:e.rowData.board.id,userInfo:user,tab:tabName});
			//win.open();
		});
		
		bgView.contentHeight=view.height+25+h+48; //h is the tableview all rows height
	}
	var ScrollViewFill = require("publicUI/ScrollPictureView");
	
	/**********reset the scrollview height**********/
	var loadDataAndChangeScrollHeight=function(datas) {
		var sv= new ScrollViewFill(datas,bottomView,tabName);
		bgView.contentHeight=view.height+25+sv.max+48;  //top(90) + toolbar(25) + bottom (dynamic height) + tabbar
	}
	
	var loadPins=function(datas){
		if (toolBar){
			toolBar.labels[1]= datas.length+ (datas.length>1? L('pins') : L('pin') );
		}
		loadDataAndChangeScrollHeight(datas);
		/*var sv= new ScrollViewFill(datas,bottomView,tabName);
		  bgView.contentHeight=view.height+25+sv.max+48;  //top(90) + toolbar(25) + bottom (dynamic height) + tabbar
		*/
	}
	var loadLikes=function(datas){
		if (toolBar){
			toolBar.labels[2]= datas.length+(datas.length>1? L('likes') : L('like') );
		}
		
		loadDataAndChangeScrollHeight(datas);
		/*var sv=new ScrollViewFill(datas,bottomView,tabName);
		bgView.contentHeight=view.height+25+sv.max+48;  //top(90) + toolbar(25) + bottom (dynamic height) + tabbar
		*/
	}
	var userService= require("services/UserService");
	
	if (Titanium.Platform.name == 'iPhone OS')
	{
		
		var toolView = Ti.UI.createView({
			top:90,
			left:0,
			width:320,
			height:35,
			backgroundImage:'images/bottom_bg.png'
		});
		self.add(toolView);
		var toolBar = Titanium.UI.iOS.createTabbedBar({
			top : 5,
			left : 10,
			width : 300,
			height : 25,
			labels : [ user.board_count+ (user.board_count>1? L('collections') : L('collection') ),
					 user.pin_count+(user.pin_count>1? L('pins') : L('pin') ), 
					 user.like_count+(user.like_count>1? L('likes') : L('like'))],
			backgroundColor : "#cfcfcf",// 'maroon',
			style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
			index : 1,			
		});
		toolView.add(toolBar);
		toolBar.addEventListener("click", function(e) {
			createContent();
			if(e.index == 0) {
				//boards;
				userService.getBoards(userId, loadBoards);
			} else if(e.index == 1) {
				//pins
				userService.getPins(userId, loadPins);
			} else {
				//likes;
				userService.getLikes(userId, 1, loadLikes);
			}
		});


		
	}
	
	createContent();
	userService.getPins(userId,loadPins);
	return bgView;
}

module.exports = UserProfileView;
