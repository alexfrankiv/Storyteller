var storyTree = require('./StoryTree.js');
var api = require("../../../Backend/api");

$(document).ready(function () {
   

	///for testing only!
	$('#editor').on('hide.bs.modal', function () {
		$('#editor-title').val('');
		$('#editor-text').val("");
		$('#editor-child-left').text('');
		$('#editor-child-center').text('');
		$('#editor-child-right').text('');
	});
	$('#editor-save').click(function (e) {
		var nodeAbstract = storyTree._nodeById(storyTree.getLastMod());
		nodeAbstract.title = $('#editor-title').val();
		nodeAbstract.message = $('#editor-text').val();
		//for div in tree
		//$('#'+storyTree.getLastMod()).find('.story-node-text').html($('#editor-text').val());
		$('#editor').modal('hide');
	});
	$('#story-save-btn').click(function(e){
		//e.preventDefault();
		var root = storyTree.getRoot();
		var author = ($('#authors-name').val())? $('#authors-name').val():'Anonymous';
		var storyObject = {
			title: root.title,
			root: root,
			author: author,
			description: $('#description').val(),
			genre: $('#genre').val()
		};
		console.log(storyObject);
        alert("Before saving"+storyObject);
      
		//save story method should be here!
        api.createOrder(storyObject,function(err,data){
            if(!err){
               alert("Check for saving");
            }else{
               alert("not saved");
            }
        });
		return true;
	});
	///for testing only!

	jsPlumb.ready(function () {
		//storyTree.drawRandTree();		
		storyTree.drawTreeRoot();
	});

});
