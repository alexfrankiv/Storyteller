var API_URL = "http://localhost:5050";

function backendGet(url, callback) {
	$.ajax({
		url: API_URL + url,
		type: 'GET',
		success: function (data) {

			callback(null, data);
		},
		fail: function () {
			callback(new Error("Ajax Failed"));
		}
	})

}

function backendPost(url, data, callback) {
	$.ajax({
		url: API_URL,
		url,
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (data) {
			callback(null, data);
		},
		fail: function () {
			callback(new Error("Failed to upload to server"));
		}

	})
};
//get unique ObjectID for the document
exports.getById = function (data, callback) {
		backendGet('/api/story/' + data, callback);
	}
	//show all stories from the db 
exports.show = function (callback) {
	backendGet('/api/show-stories/', callback);
};
//show them sorted by title ascending
exports.showSorted = function (callback) {
	backendGet('/api/showsorted/', callback);
};
//show all sorted author ascending
exports.showSortedAuthorAsc = function (callback) {
	backendGet('/api/showsorted-author-asc/', callback);
};
exports.showSortedTitleDes = function (callback) {
	backendGet('/api/showsorted-title-des/', callback);
};
exports.showSortedAuthorDes = function (callback) {
	backendGet('/api/showsorted-author-des', callback);
};
//show all docs of one author
exports.showByAuthor = function (data, callback) {

	backendGet('/api/show-by-author/' + data, callback);
};
//show all docs with the same description 

exports.showByDescription = function (data, callback) {
	backendGet('/api/show-by-description/' + data, callback);
};

//show all dosc with the same title

exports.showByTitle = function (data, callback) {
	backendGet('/api/show-by-title/' + data, callback);
};

//delete all documents
exports.deleteAll = function (callback) {
	backendGet('/api/delete-all/', callback);
};
//create one doc from data object(StoryObject)
exports.create = function (data, callback) {
	backendPost("/api/save-story/", data, callback);
};
//delete one doc using _id  
exports.delete = function (data, callback) {
	backendGet('/api/delete/' + data, callback);
}; //update one doc using _id
//ONE SHOULD IMPORT ONLY JSON OBJECTS WITH _ID HERE
exports.update = function (data, callback) {
	backendPost('/api/update/', data, callback);
};
