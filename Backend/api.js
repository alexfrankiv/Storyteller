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


	}).save(function (err, data) {
		if (!err) {
			console.log("Saved story");
		} else {
			res.send(data);
			console.log("All is very bad "+err.data);
		}
	});
};
exports.show = function (req, res) {
	StoryModel.find({}, function (err, stories) {
		if (err) {
			console.log("Not retrieved all stories");
		} else {
			res.send(stories);
		}
	});
};
exports.showSorted = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'title': 1
	}).exec(function (err, stories) {
		if (err) {
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by ascending title");
			res.send(stories);
		}
	});
};
exports.showSortedAuthorAsc = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'author': 1
	}).exec(function (err, stories) {
		if (err) {
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by ascending author");
			res.send(stories);
		}
	});
};
exports.showSortedAuthorDes = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'author': -1
	}).exec(function (err, stories) {
		if (err) {
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by descending author");
			res.send(stories);
		}
	});
};
exports.showSortedTitleDes = function (req, res) {
	console.log("Storing works");
	StoryModel.find({}).sort({
		'title': -1
	}).exec(function (err, stories) {
		if (err) {
			console.log("Not retrieved all stories");
		} else {
			console.log("Retrieved all stories sorted by descending title");
			res.send(stories);
		}
	});
};


exports.showByAuthor = function (req, res) {
	StoryModel.find({
		"author": req.params.author
	}, function (err, stories) {
		if (err) {
			console.log("Can't find stories by author");
		} else {
			console.log("Successfully found some stories with that author");
			res.send(stories);
		}
	});


};
exports.showByTitle = function (req, res) {
	StoryModel.find({
		"title": req.params.title
	}, function (err, stories) {
		if (err) {
			console.log("Can't find stories by title");
		} else {
			console.log("Successfully found some stories with that titile");
			res.send(stories);
		}
	});
};
exports.showByDescription = function (req, res) {
	StoryModel.find({
		"description": req.params.description
	}, function (err, stories) {
		if (err) {
			console.log("Can't find stories by description");
		} else {
			console.log("Successfully found some stories with that description");
			res.send(stories);
		}
	});
};
exports.deleteAll = function (req, res) {
	StoryModel.remove({}, function (err) {
		if (err) {
			console.log("Didn't delete anything");
		} else {
			console.log("Everything deleted");
		}
	});
};

exports.getById = function (req, res) {
	StoryModel.findOne({
		"_id": req.params.id
	}, function (err, story) {
		//this conditional shold be for testing only!!!
		if (!err) {
			console.log("retrieved 1 story");
		} else {
			console.log("not retrieved")
		}
		res.send(err, story);
	});
}

exports.delete = function (req, res) {
	StoryModel.remove({
		"_id": req.params.id
	}, function (err) {
		if (err) {
			console.log("Didn't delete anything");
		} else {
			console.log("Deleted one story with specific id");
		}
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

			console.log("Successfully updated story ");

		}
	});
};
