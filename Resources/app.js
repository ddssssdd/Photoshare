var settings={showAnimation:true,
	serverUrl:"http://beta.pinspire.com/ios/",
	defaultImageColor:'#eee',
	timeOut:20000,
	noneInternet:Ti.Locale.getString('no_access')}

var AppMainWindow=require("ui/AppMainWindow");
var tabGroup = new AppMainWindow();
tabGroup.open();

Ti.API.info(Ti.Locale.currentCountry);
Ti.API.info(Ti.Locale.currentLanguage);
Ti.API.info(Ti.Locale.currentLocale);

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
