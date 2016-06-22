var storyTree = require('./StoryTree.js');

var api = require("./api.js");


$(document).ready(function () {
/*var Saved_Stories=[];
    
    api.show(function(err,data){
        
if(!err){
    Saved_Stories = data;
    Saved_Stories.forEach(function(story,index,Saved_Stories){
        console.log(" 1 title:"+story._id);
        console.log("1 author:"+story.author);
    });
console.log("Showed good");}
        });
    
    api.showByAuthor("Nazar",function (error,data){
         if(!error){
             data.forEach(function(story,index,data){
                 console.log("2 author:"+story.author);
             });
            
         }   
        });
     api.showByTitle("Nazar",function (error,data){
         if(!error){
             data.forEach(function(story,index,data){
                 console.log("3 title:"+story.title);
             });
            
         } else{
             console.log("3 Nothing found");
         }  
        });
      api.showSorted(function(err,stories){
      if(err){
         console.log("Did not find sorted docs");
      } else{
          Saved_Stories= stories;
          Saved_Stories.forEach(function(story,index,Saved_Stories){
             console.log("story:"+story.title);
          });
      } 
        
    });
      api.showByDescription("Nazar",function (error,data){
         if(!error){
             data.forEach(function(story,index,data){
                 console.log("4 desciption:"+story.description);
             });
            
         } else{
             console.log("5 Nothing found");
         }  
        });
    
     var id= '5769c580a0cde04801d1b717';
         api.getId(id,function(err,data){
                    if(!err){
                        alert("Id"+data._id);
                        //alert(data._id);
                    }else{
                      alert("ID NOT FOUND");
                    }
                });
    api.delete(id, function(err,data){
        if(!err){
            alert("Deleted 1 item ");
        }else{
            alert("Not deleted(BAD)");
        }
    })
    
    */
    
                      
 
	///for testing only!
	$('#editor').on('hide.bs.modal', function () {
		$('#editor-title').val('');
		$('#editor-text').val("");
		$('#editor-child-left').text('');
		$('#editor-child-center').text('');
		$('#editor-child-right').text('');
	});
	$('#editor-save').click(function (e) {
		if($('#editor-title').val()&&$('#editor-text').val()){
		var nodeAbstract = storyTree._nodeById(storyTree.getLastMod());
		nodeAbstract.title = $('#editor-title').val();
		nodeAbstract.message = $('#editor-text').val();
		//for div in tree
		//$('#'+storyTree.getLastMod()).find('.story-node-text').html($('#editor-text').val());
		$('#editor').modal('hide');
		}
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
       // alert("Before saving"+storyObject);
      /*  var id= '57691ab1a124951c0cf77acc';
         api.getId(id,function(err,data){
                    if(!err){
                        alert("All is good");
                        alert(data._id);
                    }else{
                        alert("ID NOT FOUND");
                    }
                });
           var Saved_Stories = [];*/
      
       /* api.showByAuthor(storyObject,function (error,data){
         if(!err){
             console.log(data);
         }   
        });
        api.delete(storyObject,function(error,data){
            if(!err){
console.log("Successfully deleted");}
});*/
        
		//save story method should be here!
        api.create(storyObject,function(err,data){
            if(!err){
               console.log("Saved");
               
            }else{
            alert("failed");
            }
        });
       
        /*
        api.show(function(err,data){
if(!err){
console.log("Showed good");}
        });
        api.deleteAll(function(error,data){
            if(!err){
                console.log("Successfully deleted");
            }
        });
        */
     
    
  
		return false;
	});
	///for testing only!

	jsPlumb.ready(function () {
		//storyTree.drawRandTree();		
		storyTree.drawTreeRoot();
	});

});
