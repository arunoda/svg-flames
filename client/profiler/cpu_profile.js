CPUProfile = function(profile) {
  this.profile = profile;
  this.paths = profile.head.children;
  this.functionsMap = {};
  this.functions = [];
  this.totalHitCount = 0;
};

CPUProfile.prototype.process = function() {
  var self = this;
  this.paths.forEach(function(path, pathId) {
    if(path.functionName != '(program)') {
      self.totalHitCount += self._buildFunctions(path, pathId);
    }
  });

  this.functions.sort(function(a, b) {
    return b.totalHitCount - a.totalHitCount;
  });
};

CPUProfile.prototype._buildFunctions = function(node, pathId, depth) {
  var self = this;
  depth = depth || 0;

  var rootFunc = self._getFunction(node);
  rootFunc.totalHitCount += node.hitCount;
  rootFunc.totalHitCountByPath[pathId] = rootFunc.totalHitCountByPath[pathId] || 0;
  rootFunc.totalHitCountByPath[pathId]+= node.hitCount;

  node.totalHitCount = node.hitCount;
  node._depth = depth;

  if(node.children) {
    node.children.forEach(function(child, index) {
      node.totalHitCount += self._buildFunctions(child, pathId, depth + 1);
    });
  }

  return node.totalHitCount;
};

CPUProfile.prototype._getFunction = function(functionNode) {
  var key = functionNode.callUID;
  var func = this.functionsMap[key];
  if(!func) {
    this.functionsMap[key] = func = _.omit(functionNode, 'children', 'hitCount');
    func.totalHitCount = 0;
    func.totalHitCountByPath = {};
    this.functions.push(func);
  }
  return func;
};