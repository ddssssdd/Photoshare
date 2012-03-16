var TableViewScrollDownRefresh=function(tableView,callBackFunction){
	
	var updating = false;
	var loadingRow = Ti.UI.createTableViewRow({
		title : "Loading..."
	});

	function beginUpdate() {
		updating = true;
		

		tableView.appendRow(loadingRow);

		if (callBackFunction){
			callBackFunction.call(this,endUpdate);
		}
		
	}

	function endUpdate() {
		updating = false;

		tableView.deleteRow(lastRow, {
			animationStyle : Titanium.UI.iPhone.RowAnimationStyle.NONE
		});		
	}

	var lastDistance = 0;
	// calculate location to determine direction

	tableView.addEventListener('scroll', function(e) {
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;

		// going down is the only time we dynamically load,
		// going up we can safely ignore -- note here that
		// the values will be negative so we do the opposite
		if(distance < lastDistance) {
			// adjust the % of rows scrolled before we decide to start fetching
			var nearEnd = theEnd * .75;

			if(!updating && (total >= nearEnd)) {
				beginUpdate();
			}
		}
		lastDistance = distance;
	});


}
module.exports = TableViewScrollDownRefresh;
