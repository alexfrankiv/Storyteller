var mongoose = require( 'mongoose' );

var Schema   = mongoose.Schema;

var Node = new Schema {
    title: String,
	message: String,
	id:Number,
	children: [Number]

};
var Tree= new Schema {
    id:Number,
	children=[Node],
	message:String,
	title:String,
	
	offset:Number,
		
	x:Number,
        y:Number
};
var storyObject =new Schema{
			title: String,
			root: Tree,
			author: String,
			description: String,
			genre:String
		};
 var nodeModel= mongoose.model( 'node', Node );
 var treeModel = mongoose.model('tree',Tree);
 var storyModel =mongoose.model('story',storyObject);
exports.nodeModel= nodeModel;
exports.treeModel= treeModel;
exports.storyModel = storyModel;
exports.create = function(req,res){
    new storyModel({
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
}
               exports.show = function(req,res){
    storyModel.find(function(err,stories){
        if(err){
            console.log("Not retrieved all stories");
        }else{
            res.send(stories);
        }
    });
};
exports.delete= function(req,res){
    storyModel.find({'title':req.body.title,'root':req.body.root,'author':req.body.author,'description':req.body.description,'genre':req.body.genre},function(err,story){
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
   }  ;
   
 

        
        
        
  

 var db = mongoose.connect( 'mongodb://localhost:27017' );
 
db.on('error', function (err) {
console.log('connection error', err);
});
db.once('open', function () {
console.log('connected.');
});