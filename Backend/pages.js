exports.editorPage = function (req, res) {
	res.render('editorPage', {
		pageTitle: 'Create a story'
	});
};

exports.readerPage = function(req, res){
	res.render('readerPage', {
		pageTitle: 'Read the story'
	});
};

