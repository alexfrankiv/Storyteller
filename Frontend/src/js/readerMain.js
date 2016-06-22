//dependencies
var storage = require('./storage');
var api = require('./api');

//global
var TREE_ROOT = null;
var ROUTE = [];

var init = function(){
	var storyFromStorage = storage.get('currentStory');
	if(storyFromStorage){
		TREE_ROOT = storyFromStorage;
		console.log('TREE_ROOT = storyFromStorage;');
	}else{
		console.log('else!');
		var idFromStorage = storage.get('currentReqId');
		if(idFromStorage)
			api.getById(idFromStorage, function(err, data){
				if(data){
					console.log(data);
					TREE_ROOT = data;
					console.log("TREE_ROOT = data")
				}
				else{
					//MUST BE ENBETTERED!
				console.log('invalid story id req');
				}
			});
		else{
			//MUST BE ENBETTERED!
				console.log('no data in storage');
				alert('invalid page load!');
		}			
	}
};

$(document).ready(function(){
	
	
	//onload
	init();
});