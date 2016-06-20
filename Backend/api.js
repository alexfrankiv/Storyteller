var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/test');


var Schema = mongoose.Schema;

var NodeSchema = new Schema({
    title: String,
	message: String,
	id:Number,
	children: [Number]

});
var TreeSchema= new Schema ({
    id:Number,
	children:[NodeSchema],
	message:String,
	title:String,
	
	offset:Number,
		
	x:Number,
        y:Number
});
var StorySchema =new Schema({
			title: String,
			root: TreeSchema,
			author: String,
			description: String,
			genre:String
		});

 var NodeModel= mongoose.model('NodeModel', NodeSchema );
 var TreeModel = mongoose.model('TreeModel',TreeSchema);
 var StoryModel =mongoose.model('StoryModel',StorySchema);
exports.NodeModel= NodeModel;
exports.TreeModel= TreeModel;
exports.StoryModel = StoryModel;
                                
exports.create = function(req,res){

    new StoryModel({
        
       title:req.body.title,
        root:req.body.root,
        author:req.body.author,
        description:req.body.description,
        genre:req.body.genre,
        
        
    }).save(function(err){
        if(err){
console.log("Saved story");}else{
    console.log("All is very bad");
}
    });
};
               exports.show = function(req,res){
    StoryModel.find(function(err,stories){
        if(err){
            console.log("Not retrieved all stories");
        }else{
            res.send(stories);
        }
    });
};
exports.delete= function(req,res){
    StoryModel.find({'title':req.body.title,'root':req.body.root,'author':req.body.author,'description':req.body.description,'genre':req.body.genre},function(err,story){
        if(err){
console.log("have not found anything to delete");}else{
    story.remove(function(err, story){
        console.log("Successfully deleted story ");
    });
}
    });
};

   exports.findOneAndUpdate = function(req,req){
       storyModel.findOneAndUpdate({'title':req.body.title,'root':req.body.root,'author':req.body.author,'description':req.body.description,'genre':req.body.genre}),function(err,story){
if(err){
console.log("Failed to load story");}else{
    console.log("One story is successfully updated");
}}
   };
   
 

        
        
        
  

  
