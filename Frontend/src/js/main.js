var storyTree = require('./StoryTree.js');

$(document).ready(function () {
	///for testing only!
	$('#editor').on('hide.bs.modal', function () {
		$('#editor-title').val('');
		$('#editor-text').val("");
		$('#editor-child-left').text('');
		$('#editor-child-center').text('');
		$('#editor-child-right').text('');
	});
	$('#editor-save').click(function(e){
		var nodeAbstract = storyTree._nodeById(storyTree.getLastMod());
		console.log(nodeAbstract);
		nodeAbstract.title = $('#editor-title').val();
		nodeAbstract.message = $('#editor-text').val();
		//for div in tree
		$('#'+storyTree.getLastMod()).find('.story-node-text').html($('#editor-text').val());
		$('#editor').modal('hide');
	});
	///for testing only!

	jsPlumb.ready(function () {
		//storyTree.drawRandTree();		
		storyTree.drawTreeRoot();
	});

});
