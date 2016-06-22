var Templates = require('./templates');
var api =  require("./api");
var storage = require('./storage');

    console.log("Document loaded");
    var $story_list = $(".load-wrap");//class to add all stories
    
    //view all stories in array given
    function initializeStoryList(List){
    
           $story_list.html("");
        
        
        function showOneStory(story){
            var html_code = Templates.StoryCard({"story":story});
        
           var  $html_code=$(html_code);
            $html_code.find("#link-to-read").click(function(){
              
              storage.set('currentStory',story);
                storage.set('currentReqId',story._id);
            });
          
            $story_list.append($(html_code));
        }
        List.forEach(showOneStory);
            
       
    }
    var Stories  = [];//global objects for all retrieved stories;
      api.show(function(err,data){
        
if(!err){

    Stories = data;
  //  console.log(Stories);
   initializeStoryList(Stories);
//.log("Showed good");
}else{
    console.log("Not showed");
}
        });
    
    $("#99").click(function(){
        var genre = $("#99").text();
        
        api.showByGenre(genre,function(err,data){
            if(!data){
                console.log("Can't display stories by genre");
            }else{
                if(Object.keys(data).length>0){
                var Stories  = data; 
                   
               initializeStoryList(Stories);
                }
        }});

        
    });
    $("#9").click(function(){
        var genre = $("#9").text();
       
        api.showByGenre(genre,function(err,data){
            if(!data){
                console.log("Can't display stories by genre");
            }else{
                if(Object.keys(data).length>0){
                var Stories  = data; 
                   
               initializeStoryList(Stories);
                }
        }});

        
    });
  $("#5").click(function(){
        var genre = $("#5").text();
       
        api.showByGenre(genre,function(err,data){
            if(!data){
                console.log("Can't display stories by genre");
            }else{
                if(Object.keys(data).length>0){
                var Stories  = data; 
                   
               initializeStoryList(Stories);
                }
        }});

        
    });
  $("#2").click(function(){
        var genre = $("#2").text();
       
        api.showByGenre(genre,function(err,data){
            if(!data){
                console.log("Can't display stories by genre");
            }else{
                if(Object.keys(data).length>0){
                var Stories  = data; 
                   
               initializeStoryList(Stories);
                }
        }});

        
    });
 $("#6").click(function(){
        var genre = $("#6").text();
        
        api.showByGenre(genre,function(err,data){
            if(!data){
                console.log("Can't display stories by genre");
            }else{
                if(Object.keys(data).length>0){
                var Stories  = data; 
                   
               initializeStoryList(Stories);
                }
        }});

        
    });
        $("#8").click(function(){
        var genre = $("#8").text();
       
        api.showByGenre(genre,function(err,data){
            if(!data){
                console.log("Can't display stories by genre");
            }else{
                if(Object.keys(data).length>0){
                var Stories  = data; 
                   
               initializeStoryList(Stories);
                }
        }});

        
    });
         $("#4").click(function(){
        var genre = $("#4").text();
       
        api.showByGenre(genre,function(err,data){
            if(!data){
                console.log("Can't display stories by genre");
            }else{
                if(Object.keys(data).length>0){
                var Stories  = data; 
                   
               initializeStoryList(Stories);
                }
        }});

        
    });
        
   
