var API_URL = "http://localhost:5050";
function backendGet(url, callback){
    $.ajax({
         url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        fail: function() {
            callback(new Error("Ajax Failed"));
        }
    })
    
}
function backendPost(url,data,callback){
    $.ajax({
        url:API_URL, url,
        type:'POST',
        contentType:'application/json',
data:JSON.stringify(data),
        success: function(data){
callback(null,data);},fail:function() {
    callback(new Error("Failed to upload to server"));
}
        
    })
}
exports.show = function(calback){
    backendGet('/api/show-stories/',callback);
}
exports.create = function (data,callback){
    backendPost("/api/save-story/",data,callback);
};
exports.delete = function (data,callback){
    backendPost('/api/delete-one/',data,callback);
};
exports.findOneAndUpdate = function (data,callback){
    backendPost('/api/find-one-and-update/');
};
