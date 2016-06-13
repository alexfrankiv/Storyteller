//dependencies
var Templates = require('./templates');
var jsPlumb = require('jsPlumb');
var $canvas = $('#canvas');

///////////////////////
var node_size = 100
var horizontal_gap = 75
var vertical_gap = 50

// Draw a graph node.
function node(lbl, x, y, sz) {
	if (!sz) sz = node_size
	var h = sz / 2
	var $node = $($.parseHTML('<div class="node" id="' + lbl + '" style="left:' + (x - h) + 'px;top:' + (y - h) +
		'px;width:' + sz + 'px;height:' + sz + 'px;line-height:' + sz +
		'px;">' + lbl + '</div>'));
	$node.zoomTarget();
	$canvas.append($node);
}

// Draw a 1-pixel black dot.
function dot(x, y) {
	$canvas.append($.parseHTML('<div class="dot" style="left:' + x + 'px;top:' + y + 'px;"></div>'));
}

// Draw a line between two points.  Slow but sure...
function arc(parent, child) {
	console.warn(parent + ' + ' + child);
	jsPlumb.connect({
			source: parent,
			target: child,
			anchor: ["Top", "Bottom"],
			connector: ["Straight"],
			endpoint: "Blank"
	});
/*var dx = x1 - x0
var dy = y1 - y0
var x = x0
var y = y0
if (abs(dx) > abs(dy)) {
	var yinc = dy / dx
	if (dx < 0)
		while (x >= x1) {
			dot(x, y);
			--x;
			y -= yinc
		} else
		while (x <= x1) {
			dot(x, y);
			++x;
			y += yinc
		}
} else {
	var xinc = dx / dy
	if (dy < 0)
		while (y >= y1) {
			dot(x, y);
			--y;
			x -= xinc
		} else
		while (y <= y1) {
			dot(x, y);
			++y;
			x += xinc
		}
}*/
}

// Tree node.
function Tree(lbl, children) {
	this.lbl = lbl
	this.children = children ? children : []
		// This will be filled with the x-offset of this node wrt its parent.
	this.offset = 0
		// Optional coordinates that can be written by place(x, y)
	this.x = 0
	this.y = 0
}

Tree.prototype.is_leaf = function () {
	return this.children.length == 0
}

// Label the tree with given root (x,y) coordinates using the offset
// information created by extent().
Tree.prototype.place = function (x, y) {
	var n_children = this.children.length
	var y_children = y + vertical_gap + node_size
	for (var i = 0; i < n_children; i++) {
		var child = this.children[i]
		child.place(x + child.offset, y_children)
	}
	this.x = x
	this.y = y
}

// Draw the tree after it has been labeled w ith extent() and place().
Tree.prototype.draw = function () {
	var n_children = this.children.length
	node(this.lbl, this.x, this.y)
	for (var i = 0; i < n_children; i++) {
		var child = this.children[i];
		//arc(this.lbl, child.lbl);
		child.draw();
	}
}

Tree.prototype.drawLines = function () {
	var n_children = this.children.length
	for (var i = 0; i < n_children; i++) {
		var child = this.children[i];
		arc(this.lbl, child.lbl);
		child.drawLines();
	}
}

// Recursively assign offsets to subtrees and return an extent
// that gives the shape of this tree.
//
// An extent is an array of left-right x-coordinate ranges,
// one element per tree level.  The root of the tree is at
// the origin of its coordinate system.
//
// We merge successive extents by finding the minimum shift
// to the right that will cause the extent being merged to
// not overlap any of the previous ones.
Tree.prototype.extent = function () {
	var n_children = this.children.length

	// Get the extents of the children
	var child_extents = []
	for (var i = 0; i < n_children; i++)
		child_extents.push(this.children[i].extent())

	// Compute a minimum non-overlapping x-offset for each extent
	var rightmost = []
	var offset = 0
	for (i = 0; i < n_children; i++) {
		var ext = child_extents[i]
			// Find the necessary offset.
		offset = 0
		for (var j = 0; j < min(ext.length, rightmost.length); j++)
			offset = max(offset, rightmost[j] - ext[j][0] + horizontal_gap)
			// Update rightmost
		for (var j = 0; j < ext.length; j++)
			if (j < rightmost.length)
				rightmost[j] = offset + ext[j][1]
			else
				rightmost.push(offset + ext[j][1])
		this.children[i].offset = offset
	}
	rightmost = null // Gc, come get it.

	// Center leaves between non-leaf siblings with a tiny state machine.
	// This is optional, but eliminates a minor leftward skew in appearance.
	var state = 0
	var i0 = 0
	for (i = 0; i < n_children; i++) {
		if (state == 0) {
			state = this.children[i].is_leaf() ? 3 : 1
		} else if (state == 1) {
			if (this.children[i].is_leaf()) {
				state = 2
				i0 = i - 1 // Found leaf after non-leaf. Remember the non-leaf.
			}
		} else if (state == 2) {
			if (!this.children[i].is_leaf()) {
				state = 1 // Found matching non-leaf. Reposition the leaves between.
				var dofs = (this.children[i].offset - this.children[i0].offset) / (i - i0)
				offset = this.children[i0].offset
				for (j = i0 + 1; j < i; j++)
					this.children[j].offset = (offset += dofs)
			}
		} else {
			if (!this.children[i].is_leaf()) state = 1
		}
	}

	// Adjust to center the root on its children
	for (i = 0; i < n_children; i++)
		this.children[i].offset -= 0.5 * offset

	// Merge the offset extents of the children into one for this tree
	var rtn = [[-0.5 * node_size, 0.5 * node_size]]
		// Keep track of subtrees currently on left and right edges.
	var lft = 0
	var rgt = n_children - 1
	i = 0
	for (i = 0; lft <= rgt; i++) {
		while (lft <= rgt && i >= child_extents[lft].length) ++lft
		while (lft <= rgt && i >= child_extents[rgt].length) --rgt
		if (lft > rgt) break
		var x0 = child_extents[lft][i][0] + this.children[lft].offset
		var x1 = child_extents[rgt][i][1] + this.children[rgt].offset
		rtn.push([x0, x1])
	}
	return rtn
}

// Return what the bounding box for the tree would be if it were drawn at (0,0).
// To place it at the upper left corner of a div, draw at (-bb[0], -bb[1])
// The box is given as [x_left, y_top, width, height]
function bounding_box(extent) {
	var x0 = extent[0][0]
	var x1 = extent[0][1]
	for (var i = 1; i < extent.length; i++) {
		x0 = min(x0, extent[i][0])
		x1 = max(x1, extent[i][1])
	}
	return [x0, -0.5 * node_size, x1 - x0, (node_size + vertical_gap) * extent.length - vertical_gap]
}

function min(x, y) {
	return x < y ? x : y
}

function max(x, y) {
	return x > y ? x : y
}

function abs(x) {
	return x < 0 ? -x : x
}

// Generate a random tree with given depth and minimum number of children of the root.
// The min_children field is optional.  Use e.g. 2 to avoid trivial trees.
var node_label = 0

function random_tree(depth, min_children) {
	var n_children = depth <= 1 || Math.random() < 0.5 ? 0 : Math.round(Math.random() * 4)
	if (min_children) n_children = max(n_children, min_children)
	var children = []
	for (var i = 0; i < n_children; i++)
		children.push(random_tree(depth - 1, min_children - 1))
	return new Tree('' + node_label++, children)
}

var drawRandTree = function () {
	//window.scroll((storyTree.$canvas.width()-window.innerWidth)/2,0);	
	var tree;
	// Generate a random tree.
	tree = random_tree(10, 2)

	console.log(tree);
	// Label it with node offsets and get its extent.
	e = tree.extent();

	// Retrieve a bounding box [x,y,width,height] from the extent.
	bb = bounding_box(e)

	// Label each node with its (x,y) coordinate placing root at given location.
	tree.place(-bb[0] + horizontal_gap, -bb[1] + horizontal_gap)

	// Draw using the labels.
	tree.draw();
	tree.drawLines();
}

///////////////////////

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
	$node.css({
		top: node.coord.oy,
		left: node.coord.ox
	});
	$node.attr('id', node.id);
	if (node.coord.ox > 2 / 3 * $canvas.width() || node.coord.oy > 2 / 3 * $canvas.height()) {
		$canvas.css({
			height: 2 * $canvas.height(),
			width: 2 * $canvas.width()
		});
	}
	$canvas.append($node);
	//$node.zoomTarget();

}

var buildTree = function () {
	//for test only! ROOT
	addOneNode(defaultNode, {
		ox: ($canvas.width() / 2),
		oy: 100
	}, 1);
}

exports.buildTree = buildTree;
exports.$canvas = $canvas;

exports.drawRandTree = drawRandTree;
