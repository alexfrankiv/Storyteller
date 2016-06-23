var API_URL = "http://localhost:5050";

function backendGet(url, res_data) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            res_data(data);
        },
        fail: function() {
           // callback(new Error("Ajax Failed"));
            res_data({});
        }
    })
}

function backendPost(url, data, res_data) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            res_data(data);
        },
        fail: function() {
           // callback(new Error("Ajax Failed"));
            res_data({});
        }
    })
}
//get unique ObjectID for the document
exports.getById = function (data, res_data) {
	//Look here!!!
		backendGet('/api/story/', data, res_data);
	}
	//show all stories from the db 
exports.show = function (res_data) {
	backendGet('/api/show-stories/', res_data);
};
//show them sorted by title ascending
exports.showSorted = function (res_data) {
	backendGet('/api/showsorted/', res_data);
};
//show all sorted author ascending
exports.showSortedAuthorAsc = function (res_data) {
	backendGet('/api/showsorted-author-asc/', res_data);
};
exports.showSortedTitleDes = function (res_data) {
	backendGet('/api/showsorted-title-des/', res_data);
};
exports.showByGenre = function (data,res_data) {
	backendGet('/api/show-by-genre/'+data, res_data);
};

exports.showSortedAuthorDes = function (res_data) {
	backendGet('/api/showsorted-author-des', res_data);
};
//show all docs of one author
exports.showByAuthor = function (data, res_data) {

	backendGet('/api/show-by-author/' + data, res_data);
};
//show all docs with the same description 

exports.showByDescription = function (data, res_data) {
	backendGet('/api/show-by-description/' + data, res_data);
};

//show all dosc with the same title

exports.showByTitle = function (data, res_data) {
	backendGet('/api/show-by-title/' + data, res_data);
};

//delete all documents
exports.deleteAll = function (res_data) {
	backendGet('/api/delete-all/', res_data);
};
//create one doc from data object(StoryObject)
exports.create = function (data, res_data) {
	backendPost("/api/save-story/", data, res_data);
};
//delete one doc using _id  
exports.delete = function (data, res_data) {
	backendGet('/api/delete/' + data, res_data);
}; //update one doc using _id
//ONE SHOULD IMPORT ONLY JSON OBJECTS WITH _ID HERE
exports.update = function (data, res_data) {
	backendPost('/api/update/', data, res_data);
};

