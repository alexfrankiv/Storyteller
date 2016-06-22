var fs = require('fs');
var ejs = require('ejs');

exports.StoryTree_Node = ejs.compile(fs.readFileSync('./Frontend/src/Templates/story-node.ejs', 'utf8'));

