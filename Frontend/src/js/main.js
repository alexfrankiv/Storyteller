
var storyTree = require('./StoryTree.js');

$(document).ready(function () {	
	storyTree.drawRandTree();
	
    jsPlumb.ready(function(){
	//storyTree.buildTree();
		//init();
	});

});