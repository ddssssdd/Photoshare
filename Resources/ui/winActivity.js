var winActivity=function(tab){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png"
	});
	var tableView = Ti.UI.createTableView({
		data:["Loading..."]
	})
	self.add(tableView);
	var currentTab = tab;
	var processData = function(datas){
		var tbl_data= [];
		for(var i=0;i<datas.length;i++){
			var f = datas[i];
			
			var row = Ti.UI.createTableViewRow({height:"auto"});
			row.leftImage = "http://c707237.r37.cf3.rackcdn.com/1479724.328142005595554E7_small_u.JPEG"//"http://beta.pinspire.com.hk/images/avatar-default.jpg";
			
			
			var label = Ti.UI.createLabel({
				text : f.lastname+" " + f.firstname,
				color : '#420404',
				shadowColor : '#FFFFE6',
				shadowOffset : {
					x : 0,
					y : 1
				},
				textAlign : 'left',
				top : 20,
				left : 85,
				width : 'auto',
				height : 'auto',
				font : {
					fontWeight : 'bold',
					fontSize : 18
				}
			});
			if(Titanium.Platform.name == 'android') {
				label.top = 10;
			}
			row.add(label);

			
			var label2 = Ti.UI.createLabel({
				text : f.operate,
				color : '#420404',
				shadowColor : '#FFFFE6',
				textAlign : 'left',
				shadowOffset : {
					x : 0,
					y : 1
				},
				font : {
					fontWeight : 'bold',
					fontSize : 13
				},
				bottom : 22,
				height : 'auto',
				left : 85,
				right : 50
			});
			if(Titanium.Platform.name == 'android') {
				label2.right = 30;
			}
			row.add(label2);
			row.activity = f;

			/*
			var view = Ti.UI.createView({
				top:0,
				width:320,
				height:50
			})
			var image = Ti.UI.createImageView({
				image:"http://beta.pinspire.com.hk/images/avatar-default.jpg",
				width:30,
				height:30,
				top:10,
				left:10
			});
			view.add(image);
			var labelUser = Ti.UI.createLabel({
				text : f.lastname+" " + f.firstname,
				top:5,
				left: 100,
				font:{fontFamily:'Helvetica Neue',fontSize:16,fontWeight:'bold'}
			})
			view.add(labelUser);
			
			var labelActivity=Ti.UI.createLabel({
				text: f.operate,
				top:40,
				left: 100,
				font:{fontFamily:'Arial',fontSize:12}
			})
			view.add(labelActivity);
			
			row.add(view);
			*/
			row.hasChild = true;
			
			tbl_data.push(row);
		}
		tableView.data = tbl_data;
	};
	self.addEventListener("focus",function(e){
		//alert("i am open");
		var categoryService = require("services/CategoryService");
		categoryService.getActivityList(processData);
	});
	tableView.addEventListener("click",function(e){
		//alert(e.rowData.activity);
		//Ti.App.fireEvent("app:activity.openImage",{id:e.rowData.activity.targetId,list:[]});
		
		Ti.App.fireEvent("app:openUser",{id:e.rowData.activity.userId,tab:"tabActivity"});
		
	});
	return self;
};
module.exports = winActivity;
