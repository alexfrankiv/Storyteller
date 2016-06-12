//dependencies
var Templates = require('./templates');
var jsPlumb = require('jsPlumb');

var defaultNode = {
		title: 'New title',
		message: 'Here\'s a piece of story',
		id: null,
		coord: {
			ox: null,
			oy: null
		}
	}
	//default distance used in these funcs
var dist = 150;

var $canvas = $('#canvas');

var addOneNode = function (node, point, id) {
	if (point) {
		node.coord.ox = point.ox;
		node.coord.oy = point.oy;
	}
	if (id) {
		node.id = id;
	}
	var html_code = Templates.StoryTree_Node(node);

	var $node = $(html_code);

	$node.find('.add-child').click(function () {
		console.log('add-child!' + $canvas.width());
		addOneNode(defaultNode, {
			ox: $node.position().left,
			oy: $node.position().top + dist
		}, $node.attr('id') * 3 + 1);
		jsPlumb.connect({
			connector: "Straight",
			source: $node.attr('id'),
			target: $node.attr('id') * 3 + 1,
			anchor: ["Bottom", "Top"],
			endpoint: "Blank"
		});
	});
	$node.zoomTarget();
	$node.css({
		top: node.coord.oy,
		left: node.coord.ox
	});
	$node.attr('id', node.id);
	if(node.coord.ox>2/3*$canvas.width()||node.coord.oy>2/3*$canvas.height()){
		$canvas.css({height: 2*$canvas.height(), width: 2*$canvas.width()});
	}
	$canvas.append($node);
}

var buildTree = function () {
	//for test only! ROOT
	addOneNode(defaultNode, {
		ox: ($canvas.width() * 2 / 5),
		oy: 100
	}, 1);
}

exports.buildTree = buildTree;
