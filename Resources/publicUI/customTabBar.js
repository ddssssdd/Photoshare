CustomTabBar = function(settings) {
	var tabBarItems = [];
	var	tabCurrent = 0;

	var resetTabs = function() {
		for(var i = 0; i < tabBarItems.length; i++) {
			// Clear all the images to make sure only
			// one is shown as selected
			
			tabBarItems[i].image ="images/clear.png"	
						
		}
	};
	var setHighlightBar=function(index){		
		resetTabs();
		tabCurrent = index;
		tabBarItems[index].image = settings.imagePath + settings.items[index].selected;
		//tabItem.fireEvent('click',{});
	}

	var assignClick = function(tabItem) {
		tabItem.addEventListener('click', function(e) {
			// Just fetching the 'i' variable from the loop
			var pos = e.source.pos;

			if (tabCurrent == pos) {
				// TODO
				// Change back to root window, like the native tab action.
    			return false;
	        }		

			if (pos==2){
				Ti.App.fireEvent("app:takePhoto",{index:tabCurrent});
			}else{

				// Switch to the tab associated with the image pressed
				settings.tabBar.tabs[pos].active = true;
				tabCurrent = pos;

				// Reset all the tab images
				resetTabs();

				// Set the current tab as selected
				tabBarItems[pos].image = settings.imagePath + settings.items[pos].selected;

	
			}
					
		});
	};

	// Create the container for our tab items
	var customTabBar = Ti.UI.createWindow({
		height: settings.height,
		bottom: 0,
		//backgroundColor:'#d1d1d1'
		backgroundImage:'images/bottom_bg.png',
		isShowing:true,
		inAnimation:false
		
	});
	//customerTabBar.isShowing = true;

	for(var i = 0; i < settings.items.length; i++) {
		// Go through each item and create an imageView
		tabBarItems[i] = Titanium.UI.createImageView({
			// background is the default image
			backgroundImage: settings.imagePath + settings.items[i].image,

			// image is the selected image
			image: settings.imagePath + settings.items[i].selected,
			width: settings.width,
			height: settings.height,
			left: settings.width * i
		});

		// Pass the item number (used later for changing tabs)
		tabBarItems[i].pos = i;
		assignClick(tabBarItems[i]);

		// Add to the container window
		customTabBar.add(tabBarItems[i]);
	}

	// Display the container and it's items
	customTabBar.open();

	// Set the first item as current :)
	resetTabs();
	tabBarItems[0].image = settings.imagePath + settings.items[0].selected;
	

	return {
		setHighlightBar:function(index){
			setHighlightBar(index);
		},
		hide: function() {
			
			if (customTabBar.bottom==-50){
				return;
			}
			if (!customTabBar.isShowing){
				return;
			}
			if (customTabBar.inAnimation){
				return;
			}
			customTabBar.inAnimation = true;
			customTabBar.bottom = 0;
			customTabBar.animate({
				bottom : -50,
				duration : 200
			}, function() {
				customTabBar.bottom = -50;
				customTabBar.inAnimation = false;
			});
			customTabBar.hide();
			customTabBar.isShowing = false;
			 
		},
		show: function() {
			if (customTabBar.bottom==0){
				return;
			}
			if (customTabBar.isShowing){
				return;
			}
			if (customTabBar.inAnimation){
				return;
			}
			customTabBar.inAnimation = true;
			customTabBar.show();
			customTabBar.bottom = -50;
			customTabBar.animate({
				bottom : 0,
				duration : 200
			}, function() {
				customTabBar.bottom = 0;
				customTabBar.inAnimation = false;
			});
			customTabBar.isShowing = true;
		}
	};
};