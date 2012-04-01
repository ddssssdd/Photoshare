var TableViewPullRefresh=function(tableView,callBackFunction){
	var formatDate = function() {
		var date = new Date();
		var datestr = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
		if(date.getHours() >= 12) {
			datestr += ' ' + (date.getHours() == 12 ? date.getHours() : date.getHours() - 12) + ':' + date.getMinutes() + LL('app.pm');
		} else {
			datestr += ' ' + date.getHours() + ':' + date.getMinutes() + LL('app.am');
		}
		return datestr;
	}
	var lastRow = 4;
	var border = Ti.UI.createView({
		backgroundColor : "#ccc",
		height : 1,
		bottom : 0
	});

	var tableHeader = Ti.UI.createView({
		backgroundColor : "#fff",
		width : 320,
		height : 60
	});

	// fake it til ya make it..  create a 2 pixel
	// bottom border
	tableHeader.add(border);

	var arrow = Ti.UI.createView({
		backgroundImage : "images/blackArrow.png",
		width : 23,
		height : 60,
		bottom : 10,
		left : 20
	});

	var statusLabel = Ti.UI.createLabel({
		text : LL('app.pull_to_reload'),
		left : 55,
		width : 200,
		bottom : 30,
		height : "auto",
		color : "#000",
		textAlign : "center",
		font : {
			fontSize : 13,
			fontWeight : "bold"
		},
		shadowColor : "#999",
		shadowOffset : {
			x : 0,
			y : 1
		}
	});

	var lastUpdatedLabel = Ti.UI.createLabel({
		text : LL('app.last_update') + formatDate(),
		left : 55,
		width : 200,
		bottom : 15,
		height : "auto",
		color : "#878787",
		textAlign : "center",
		font : {
			fontSize : 12
		},
		shadowColor : "#999",
		shadowOffset : {
			x : 0,
			y : 1
		}
	});

	var actInd = Titanium.UI.createActivityIndicator({
		left : 20,
		bottom : 13,
		width : 30,
		height : 30
	});

	// add sub controls
	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(lastUpdatedLabel);
	tableHeader.add(actInd);

	// set tableview headerPullView
	tableView.headerPullView = tableHeader;

	var pulling = false;
	var reloading = false;

	function beginReloading() {
		// just mock out the reload
		setTimeout(endReloading, 500);
	}

	function endReloading() {
		// simulate loading
		if (callBackFunction){
			callBackFunction(this);	
		}
		

		// when you're done, just reset
		tableView.setContentInsets({
			top : 0
		}, {
			animated : true
		});
		reloading = false;
		lastUpdatedLabel.text = LL('app.last_update') + formatDate();
		statusLabel.text = LL('app.pull_down_to_refresh');
		actInd.hide();
		arrow.show();
	}

	//listen tableview scroll event
	tableView.addEventListener('scroll', function(e) {
		var offset = e.contentOffset.y;
		if(offset <= -65.0 && !pulling) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = LL('app.release_to_refresh');
		} else if(pulling && offset > -65.0 && offset < 0) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = LL('app.pull_down_to_refresh');
		}		
	});

	tableView.addEventListener('scrollEnd', function(e) {
		
		if(pulling && !reloading && e.contentOffset.y <= -65.0) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = LL('app.reloading');
			tableView.setContentInsets({
				top : 60
			}, {
				animated : true
			});
			arrow.transform = Ti.UI.create2DMatrix();
			beginReloading();
		}
	});
}
module.exports = TableViewPullRefresh;
