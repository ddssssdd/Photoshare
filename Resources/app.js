
var countryCode = Ti.App.Properties.getString('countryCode');
if (!countryCode){
	countryCode = 'en'
}
//countryCode = 'cn'
var llist = null; //language list
var clist=null; //country list
var getLanguage = function() {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "language/strings_" + countryCode + ".xml");
	if (!f.exists()){
		f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "language/strings_en.xml");
	}
	var fcontent = f.read().toString();
	Ti.API.info(fcontent);

	if(fcontent) {
		var xml = Ti.XML.parseString(fcontent);
		var keys = xml.documentElement.getElementsByTagName('string');
		var value = '';
		for(var i = 0; i < keys.getLength(); i++) {
			value = keys.item(i).text;
			llist[keys.item(i).getAttribute('name')] = value;
		}
	}

}
Ti.App.addEventListener("app:reload",function(){
	countryCode = Ti.App.Properties.getString('countryCode');
	if (!countryCode){
		countryCode = 'en'
	}
	llist=null;
	settings.countryCode=countryCode;
});

var LL = function(key) {
	if(!llist) {
		llist={};
		getLanguage();
	}
	return llist[key];
}


var settings={showAnimation:false,
	serverUrl:"http://www.pinspire.com/ios/",
	defaultImageColor:'#eee',
	defaultCountry:'usa',
	timeOut:20000,
	noneInternet:LL('app.no_access'),
	lanuageCode:Ti.Locale.currentLanguage,
	countryCode:countryCode,	
	getImageFile:function(filename){
		return "images/"+countryCode+"/"+filename;
	}}

var AppMainWindow=require("ui/AppMainWindow");
var tabGroup = new AppMainWindow();
tabGroup.open();



Ti.include("publicUI/customTabBar.js");

var customTabGroup = new CustomTabBar({
    tabBar: tabGroup,
    imagePath: 'images/',
    width: 64,
    height: 47,
    items: [
        { image: 'home.png', selected: 'home_on.png' },
        { image: 'explore.png', selected: 'explore_on.png' },
        { image: 'spot.png', selected: 'spot.png' },
        { image: 'activity.png', selected: 'activity_on.png' },
        { image: 'profile.png', selected: 'profile_on.png' }
    ]
});

Ti.App.addEventListener("app:tabgroup",function(e){
	if (e.isBottomTool){
		//customTabGroup.hide();
		return;
	}
	if (e.visible){
		customTabGroup.show();
	}else{
		customTabGroup.hide();
	}
});


/*
var isHide = false;

btn1.addEventListener('click', function() {
	isHide = !isHide;

	if ( isHide ) {
		btn1.title = 'Show Tabs';
		ctb.hide();		
	} else {
		btn1.title = 'Hide Tabs';
		ctb.show(); 
	}
});
*/

