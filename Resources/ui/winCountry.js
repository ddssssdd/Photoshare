var winCountry=function(){
	
	var self=Ti.UI.createWindow({
		backgroundColor:'#fff',
		tabBarHidden:true,
		fullscreen:false
	});
	
	//create topbar
	var topBar=require('publicUI/TopBarView');
	var t =new topBar();
	self.add(t);
	t.addBackButton(function(e){
		self.close();
	});
	
	/*
	//create search bar
	var searchBar=Ti.UI.createSearchBar({
		showCancel:false,
		barColor:'#d1d1d1',
		borderColor:'#aaa'
	});
	*/
	//create tableview
	var tableView=Ti.UI.createTableView({
		top:44,
		left:0,
		//search:searchBar,
		hideSearchOnSelection:true,
		data:[LL('global.pins.loading')]
	});
	self.add(tableView);
	
	
	
	
	var processData=function(datas) {		
		if (datas && datas.length>0){
			var tbl_data=[];
			for (var i=0;i<datas.length;i++) {
				var data=datas[i];
				var _hascheck=false;
				if (Ti.App.Properties.getInt('countryId') && data.showCountryId==Ti.App.Properties.getInt('countryId')) {
					_hascheck=true;
				}
				//var rowData={title:data.title,countryId:data.id,countryCode:data.domain,hasChild:false,hasCheck:_hascheck};
				
				var row=Ti.UI.createTableViewRow({
					title:data.title,
					obj:{title:data.title,countryId:data.id,countryCode:data.domain},
					hasCheck:_hascheck
				});
				row.leftImage = "images/flags/country_"+data.domain+".png";
				
				tbl_data.push(row);
			}//end for
			tableView.setData(tbl_data);
			
			//add tableview click evnet
			tableView.addEventListener('click',function(e){
				var countryid=e.row.obj.countryId;
				var countryname=e.row.obj.title;
				var countryCode = e.row.obj.countryCode;
				//save countryid
				Ti.App.Properties.setInt('countryId',countryid);
				Ti.App.Properties.setString('countryName',countryname);
				Ti.App.Properties.setString("countryCode",countryCode)
				self.close();
				
				//refresh Picturelistview according to countryid
				
				
			});
			
		}//end if
	}
	
	//load tableview data
	var categoryService = require("services/CategoryService");
	categoryService.getCountryList(processData); //to call processData method
	

	return self;
};
module.exports=winCountry;





