
var storyTree = require('./StoryTree.js');

$(document).ready(function () {	
	
    jsPlumb.ready(function(){
	storyTree.drawRandTree();
	//storyTree.buildTree();
		//init();
	});

});