var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var TreeSchema = new Schema();
TreeSchema.add({
	id: Number,
	children: [TreeSchema],
	message: String,
	title: String,

	offset: Number,

	x: Number,
	y: Number
});
var StorySchema = new Schema({
	title: String,
	root: TreeSchema,
	author: String,
	description: String,
	genre: String,

});
StorySchema.virtual('id').get(function () {
	return this._id;
});

var TreeModel = mongoose.model('TreeModel', TreeSchema);
var StoryModel = mongoose.model('StoryModel', StorySchema);
exports.TreeModel = TreeModel;
exports.StoryModel = StoryModel;

exports.create = function (req, res) {
	new StoryModel({
        

		title: req.body.title,
		root: req.body.root,
		author: req.body.author,
		description: req.body.description,
		genre: req.body.genre,


	}).save(function (err, stories) {
		if (!err) {
			console.log("Saved story");
		} else {
			res.status(500).send(err);
			console.log("All is very bad ");
		}res.status(200).send(stories);
	});
};
exports.show = function (req, res) {
	StoryModel.find({}, function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Not retrieved all stories");
		} else {
			
		}
       res.status(200).send(stories);
	});
};
exports.showSorted = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'title': 1
	}).exec(function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by ascending title");
			
		}
        res.status(200).send(stories);
	});
};
exports.showSortedAuthorAsc = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'author': 1
	}).exec(function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by ascending author");

		}
        res.status(200).send(stories);
	});
};
exports.showSortedAuthorDes = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'author': -1
	}).exec(function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by descending author");
			
		}
        res.status(200).send(stories);
	});
};
exports.showSortedTitleDes = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'title': -1
	}).exec(function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by descending title");
			
		}
         res.status(200).send(stories);
	});
};


exports.showByAuthor = function (req, res) {
	StoryModel.find({
		"author": req.params.author
	}, function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Can't find stories by author");
		} else {
			console.log("Successfully found some stories with that author");
			
		}
     res.status(200).send(stories);
	});


};
exports.showByGenre = function (req, res) {
	StoryModel.find({
		"genre": req.params.genre
	}, function (err, stories) {
		if (err) {
            
			console.log("Can't find stories by genre");
            res.status(500).send(err);
		} else {
			console.log("Successfully found some stories with that genre");

		}
     res.status(200).send(stories);
	});


};
exports.showByTitle = function (req, res) {
	StoryModel.find({
		"title": req.params.title
	}, function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Can't find stories by title");
		} else {
			console.log("Successfully found some stories with that titile");
			
		}
         res.status(200).send(stories);
	});
};
exports.showByDescription = function (req, res) {
	StoryModel.find({
		"description": req.params.description
	}, function (err, stories) {
		if (err) {
            res.status(500).send(err);
			console.log("Can't find stories by description");
		} else {
			console.log("Successfully found some stories with that description");
			
		}
        res.status(200).send(stories);
	});
};
exports.deleteAll = function (req, res) {
	StoryModel.remove({}, function (err) {
		if (err) {
            res.status(500).send(err);
			console.log("Didn't delete anything");
		} else {
			console.log("Everything deleted");
		}res.status(200).send(err);
	});
};

exports.getById = function (req, res) {
	StoryModel.findOne({
		"_id": req.params.id
	}, function (err, story) {
		//this conditional should be for testing only!!!
		if (!err) {
          //  res.status(500).send(err);
			console.log("retrieved 1 story"+story._id);
            res.send(story);
		} 
        else {
			console.log("not retrieved")
		}
		//res.send(story);
	});
}

exports.delete = function (req, res) {
	StoryModel.remove({
		"_id": req.params.id
	}, function (err) {
		if (err) {
           // res.status(500).send(err);
			console.log("Didn't delete anything");
		} else {
			console.log("Deleted one story with specific id");
		}
        res.status(200).send(err);
	});

}


//update using id 
exports.update = function (req, res) {
	StoryModel.findOneAndUpdate({
		"_id": req.body._id
	}, {
		title: req.body.title,
		root: req.body.root,
		author: req.body.author,
		description: req.body.description,
		genre: req.body.genre,
	}, {
		upsert: true
	}, function (err, story) {
		if (err) {
			console.log("have not found anything to update");
		} else {

			console.log("Successfully updated story "+story.author+story.title);

		}
        res.send(err,story);
	});
};
