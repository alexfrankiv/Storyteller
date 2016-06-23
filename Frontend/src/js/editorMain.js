var storyTree = require('./StoryTree.js');
var storage =require('./storage');
var api = require("./api.js");


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
				if ($('#editor-title').val() && $('#editor-text').val()) {
					var nodeAbstract = storyTree._nodeById(storyTree.getLastMod());
					nodeAbstract.title = $('#editor-title').val();
					nodeAbstract.message = $('#editor-text').val();
					//for div in tree
					//$('#'+storyTree.getLastMod()).find('.story-node-text').html($('#editor-text').val());
					$('#editor').modal('hide');
				}
			});
			$('#story-save-btn').click(function (e) {
				//e.preventDefault();
				var storEditStory = storage.get('editStoryId');
				var root = storyTree.getRoot();
				var author = ($('#authors-name').val()) ? $('#authors-name').val() : 'Anonymous';
				var storyObject = {
					title: root.title,
					root: root,
					author: author,
					description: $('#description').val(),
					genre: $('#genre').val()
				};
				console.log(storyObject);
				if(storEditStory){
				api.update(storyObject, function (data) {
					if (!Object.keys(data).lenght > 0) {
						console.log("Updated story");
						console.warn(data._id);
					} else {
						console("failed");
					}
				});
				}
				else{
					api.create(storyObject, function(data){
						if (!Object.keys(data).lenght > 0) {
						console.log("Created story");
						storage.set('editStoryId', data._id);
					} else {
						console("failed");
					}
					});
				}
				return false;
			});
			///for testing only!

			$('#story-new-btn').click(function () {
					var root = storyTree.getRoot();
					var author = ($('#authors-name').val()) ? $('#authors-name').val() : 'Anonymous';
					var storyObject = {
						title: root.title,
						root: root,
						author: author,
						description: $('#description').val(),
						genre: $('#genre').val()
					};
					console.log(storyObject);
					api.create(storyObject, function (data) {
						if (!Object.keys(data).lenght > 0) {
							console.log("Saved story");
							storage.set('editStoryId', data._id);
							console.warn(data._id);
						} else {
							console("failed");
						}
					});
				});

				jsPlumb.ready(function () {
					//storyTree.drawRandTree();		
					storyTree.drawTreeRoot();
				});

			});
