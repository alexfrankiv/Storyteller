function movetree(node, prop, val, orn) {
   var p = (orn == "left" || orn == "right")? "y" : "x";
   node[prop][p] += val;
 };

 function moveextent(extent, val) {
     var ans = [];
     $each(extent, function(elem) {
         elem = slice.call(elem);
         elem[0] += val;
         elem[1] += val;
         ans.push(elem);
     });
     return ans;
 };

 function merge(ps, qs) {
   if(ps.length == 0) return qs;
   if(qs.length == 0) return ps;
   var p = ps.shift(), q = qs.shift();
   return [[p[0], q[1]]].concat(merge(ps, qs));
 };

 function mergelist(ls, def) {
     def = def || [];
     if(ls.length == 0) return def;
     var ps = ls.pop();
     return mergelist(ls, merge(ps, def));
 };

 function fit(ext1, ext2, subtreeOffset, siblingOffset, i) {
     i = i || 0;
     if(ext1.length <= i ||
        ext2.length <= i) return 0;

     var p = ext1[i][1], q = ext2[i][0];
     return Math.max(fit(ext1, ext2, subtreeOffset, siblingOffset, ++i) + subtreeOffset,
                 p - q + siblingOffset);
 };

 function fitlistl(es, subtreeOffset, siblingOffset) {
   function $fitlistl(acc, es, i) {
       i = i || 0;
       if(es.length <= i) return [];
       var e = es[i], ans = fit(acc, e, subtreeOffset, siblingOffset);
       return [ans].concat($fitlistl(merge(acc, moveextent(e, ans)), es, ++i));
   };
   return $fitlistl([], es);
 };

 function fitlistr(es, subtreeOffset, siblingOffset) {
   function $fitlistr(acc, es, i) {
       i = i || 0;
       if(es.length <= i) return [];
       var e = es[i], ans = -fit(e, acc, subtreeOffset, siblingOffset);
       return [ans].concat($fitlistr(merge(moveextent(e, ans), acc), es, ++i));
   };
   es = slice.call(es);
   var ans = $fitlistr([], es.reverse());
   return ans.reverse();
 };

 function fitlist(es, subtreeOffset, siblingOffset) {
    var esl = fitlistl(es, subtreeOffset, siblingOffset),
        esr = fitlistr(es, subtreeOffset, siblingOffset);
    for(var i = 0, ans = []; i < esl.length; i++) {
        ans[i] = (esl[i] + esr[i]) / 2;
    }
    return ans;
 };

 function design(graph, node, prop, config) {
     var orn = config.orientation;
     var auxp = ['x', 'y'], auxs = ['width', 'height'];
     var ind = +(orn == "left" || orn == "right");
     var p = auxp[ind], notp = auxp[1 - ind];

     var cnode = config.Node;
     var s = auxs[ind], nots = auxs[1 - ind];

     var siblingOffset = config.siblingOffset;
     var subtreeOffset = config.subtreeOffset;

     var GUtil = Graph.Util;
     function $design(node, maxsize, acum) {
         var sval = (cnode.overridable && node.data["$" + s]) || cnode[s];
         var notsval = maxsize || ((cnode.overridable && node.data["$" + nots]) || cnode[nots]);

         var trees = [], extents = [], chmaxsize = false;
         var chacum = notsval + config.levelDistance;
         GUtil.eachSubnode(node, function(n) {
             if(n.exist) {
                 if(!chmaxsize)
                    chmaxsize = getBoundaries(graph, config, n._depth);

                 var s = $design(n, chmaxsize[nots], acum + chacum);
                 trees.push(s.tree);
                 extents.push(s.extent);
             }
         });
         var positions = fitlist(extents, subtreeOffset, siblingOffset);
         for(var i=0, ptrees = [], pextents = []; i < trees.length; i++) {
             movetree(trees[i], prop, positions[i], orn);
             pextents.push(moveextent(extents[i], positions[i]));
         }
         var resultextent = [[-sval/2, sval/2]].concat(mergelist(pextents));
         node[prop][p] = 0;

         if (orn == "top" || orn == "left") {
            node[prop][notp] = acum;
         } else {
            node[prop][notp] = -acum;
         }
         return {
           tree: node,
           extent: resultextent
         };
     };
     $design(node, false, 0);
 };

