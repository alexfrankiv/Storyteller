var storyTree = require('./StoryTree.js');

$(document).ready(function () {
	///for testing only!
	$( '#editor' ).hide();
	///for testing only!
	
	jsPlumb.ready(function () {
		//storyTree.drawRandTree();		
		storyTree.drawTreeRoot();
	});

});
