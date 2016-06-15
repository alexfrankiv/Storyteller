//dependencies
var Templates = require('./templates');
var jsPlumb = require('jsPlumb');
var $canvas = $('#canvas');
jsPlumb.setContainer($canvas);

//global const 
var DEFAULT_NODE = {
	title: 'New title',
	message: 'Here\'s a piece of story',
	id: null,
	children: []
}
var NODE_SIZE = 210;
var HORIZONTAL_GAP = 100;
var VERTICAL_GAP = 100;
var MAX_CHILDREN = 3;
var TREE_ROOT = new Tree(0, []);


//special function that returns treeNode by id
var _nodeById = function (id) {
	//counting route
	var route = [];
	while (id > 0) {
		--id;
		route.push(id % MAX_CHILDREN);
		id = (id - id % MAX_CHILDREN) / MAX_CHILDREN;
	}
	//getting node from tree by route
	var currentN = TREE_ROOT;
	for (var i = route.length - 1; i >= 0; --i) {
		currentN = currentN.children[route[i]];
	}
	return currentN;
}

// Draw a graph node with lines.
function node(id, x, y, parentId) {
	var html_code = Templates.StoryTree_Node({
		id: id,
		title: DEFAULT_NODE.title,
		message: DEFAULT_NODE.message
	});
	var $node = $(html_code);

	var h = NODE_SIZE / 2;
	$node.css({
		'left': (x - h) + 'px',
		'top': (y - h) + 'px',
		'line-height': NODE_SIZE + 'px'
	});
	//add all jquery listeners to node here!
	$node.find('.add-child').click(function (e) {
		e.preventDefault();
		var thisOne = _nodeById(id);
		if (thisOne.children.length < MAX_CHILDREN) {
			thisOne.children.push(new Tree(id * MAX_CHILDREN + 1 + thisOne.children.length, []));
			_repaintTree();
		}
	});
	$node.find('.self-remove').click(function(e){
		e.preventDefault();
		var thisOne = _nodeById(parentId);
		console.warn(thisOne.children);
		thisOne.children.splice(((id-1)%3),1);
		console.error(thisOne.children);
		console.log(parentId+' : '+((id-1)%3));
		console.log('state of tree: ');
		console.log(TREE_ROOT);
		_repaintTree();
	});
	$node.zoomTarget();
	$canvas.append($node);
}

// Tree node.
function Tree(id, children) {
	this.id = id;
	this.children = children ? children : []
	this.message = DEFAULT_NODE.message;
	this.title = DEFAULT_NODE.title;
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
	var y_children = y + VERTICAL_GAP + NODE_SIZE
	for (var i = 0; i < n_children; i++) {
		var child = this.children[i]
		child.place(x + child.offset, y_children)
	}
	this.x = x
	this.y = y
}

// Draw the tree after it has been labeled w ith extent() and place().
Tree.prototype.draw = function (parentId) {
	var n_children = this.children.length;
	node(this.id, this.x, this.y, parentId);
	if (parentId!==undefined&&parentId!==null) {
		jsPlumb.connect({
			source: parentId.toString(),
			target: this.id.toString(),
			connector: ["Straight"],
			anchor: ["Bottom", "Top"],
			endpoint: "Blank"
		});
	}
	for (var i = 0; i < n_children; i++) {
		var child = this.children[i];
			child.draw(this.id);
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
			offset = max(offset, rightmost[j] - ext[j][0] + HORIZONTAL_GAP)
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
	var rtn = [[-0.5 * NODE_SIZE, 0.5 * NODE_SIZE]]
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
	return [x0, -0.5 * NODE_SIZE, x1 - x0, (NODE_SIZE + VERTICAL_GAP) * extent.length - VERTICAL_GAP]
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

var _repaintTree = function () {
	//total kill =)
	$canvas.html('');
	jsPlumb.detachEveryConnection();
	jsPlumb.deleteEveryEndpoint();
	// Label it with node offsets and get its extent.
	e = TREE_ROOT.extent();
	// Retrieve a bounding box [x,y,width,height] from the extent.
	bb = bounding_box(e);
	// Label each node with its (x,y) coordinate placing root at given location.
	TREE_ROOT.place(-bb[0] + HORIZONTAL_GAP, -bb[1] + HORIZONTAL_GAP);
	// Draw using the divs.
	TREE_ROOT.draw();
	//scroll so that TREE_ROOT's in the centre
	//window.scroll(TREE_ROOT.x-window.innerWidth/2,0);
}

var drawRandTree = function () {
	// Generate a random tree.
	TREE_ROOT = random_tree(10, 2);
	//draw it 
	_repaintTree(TREE_ROOT);

}

var drawTreeRoot = function () {
	_repaintTree(TREE_ROOT);
}


//////////////
///EXPORTS///
/////////////

exports.$canvas = $canvas;

exports.drawRandTree = drawRandTree;
exports.drawTreeRoot = drawTreeRoot;
