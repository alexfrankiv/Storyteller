//dependencies
var storage = require('./storage');
var api = require('./api');

//global
var STORY = null;
var ROUTE = [];
var CURRENT = null;
var MAX_CHILDREN = 3;

var init = function () {
	var storyFromStorage = storage.get('currentStory');
	if (storyFromStorage) {
		STORY = storyFromStorage;
		console.log('TREE_ROOT = storyFromStorage;');
	} else {
		var idFromStorage = storage.get('currentReqId');
		if (idFromStorage)
			api.getById(idFromStorage, function (err, data) {
				if (data) {
					console.log(data);
					STORY = data;
					console.log("TREE_ROOT = data")
				} else {
					//MUST BE ENBETTERED!
					console.log('invalid story id req');
				}
			});
		else {
			//MUST BE ENBETTERED!
			console.log('no data in storage');
			//alert('invalid page load!');
		}
	}

	//this thing is for testing only!!!
	STORY = {
		title: 'Story about a book',
		root: {
			id: 0,
			children: [
				{
					id: 1,
					children: [
						{
							id: 5,
							children: [],
							message: 'Cool! that\'s great!',
							title: 'Read it',
							offset: 0,
							x: 0,
							y: 0
	},
						{
							id: 4,
							children: [],
							message: 'You\'re right! it\'s better to wait a bit',
							title: 'Not to read it',
							offset: 0,
							x: 0,
							y: 0
		},
						{
							id: 6,
							children: [],
							message: 'Shame on you',
							title: 'Throw it away!',
							offset: 0,
							x: 0,
							y: 0
		}
	],
					message: 'You\'ve taken the book! what\'s next?',
					title: 'Take the book',
					offset: 0,
					x: 0,
					y: 0
	},
				{
					id: 3,
					children: [],
					message: 'You lost your chance for a good story',
					title: 'Not to take the book',
					offset: 0,
					x: 0,
					y: 0
	}],
			message: 'You\'ve found a book in the street. What you\'ll decide to do?',
			title: 'Story about a book',
			offset: 0,
			x: 0,
			y: 0
		},
		author: 'Ivan Franko',
		description: 'Some description here',
		genre: "Drama",
	}
	//end of for-testing-only
	CURRENT = STORY.root;
	$('#story-name').html(STORY.title);
	$('#story-author').html(STORY.author);
};

var _nodeById = function (id) {
	//counting route
	var route = [];
	while (id > 0) {
		route.push(id);
		--id;
		id = Math.floor(id / MAX_CHILDREN);
	}
	//getting node from tree by route
	var currentN = TREE_ROOT;
	for (var i = route.length - 1; i >= 0; --i) {
		currentN = $.grep(currentN.children, function(e){ return e.id == route[i]; })[0];
	}
	return currentN;
}

var load = function(node){
	console.warn(node);
	$('#variants').html('');
	$('#node-title').html(node.title);
	$('#node-text').html(node.message);
	node.children.forEach(function(item){
		var $var = $('<div class="btn btn-primary btn-xs navigation-variant" id="'+item.id+'">'+item.title+'</div><br/>');
		$('#variants').append($var);
	});
$('.navigation-variant').click(function(){
	var id = $(this).attr('id');
	ROUTE.push(CURRENT.id);
	CURRENT = $.grep(CURRENT.children, function(e){ return e.id == id; })[0];
	load(CURRENT);
});
	//animations should be here!
}



$(document).ready(function () {


	//onload
	init();
	load(CURRENT);
});
