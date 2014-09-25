FlameViewer = function (cpuProfile, elementId, width, height) {
  this.cpuProfile = cpuProfile;
  this.elementId = elementId;
  this.width = width;
  this.height = height;
  this._onClick = this._handleEvents('click');
  this._onHover = this._handleEvents('hover');
};

FlameViewer.prototype.renderPath = function(pathId) {
  var self = this;
  var svgHtml = "";
  var path = this._getData(pathId);
  var el = '#' + this.elementId;

  renderNode(path);

  $(el).off('click', this._onClick);
  $(el).off('mouseover', this._onHover);

  $(el).html("<svg width='" + this.width + "' height='" + this.height + "'>" + svgHtml + "</svg>");

  $(el).on('click', 'rect, text', this._onClick);
  $(el).on('mouseover', 'rect, text', this._onHover);

  function renderNode(node) {
    node = _.clone(node);
    node.viewer = self;
    svgHtml += Blaze.toHTMLWithData(Template.flameBar, node);

    if(node.children && node.children.length > 0) {
      var children = self._getChildren(node);
      children.forEach(function(child) {
        renderNode(child, node);
      });
    }
  }
};

FlameViewer.prototype.destroy = function() {
  
};

FlameViewer.prototype._getData = function (pathId) {
  var path = this.cpuProfile.paths[pathId];
  this._maxWidth = path.totalHitCount;
  path._x = 0;
  return path;
};

FlameViewer.prototype._getChildren = function (node) {
  var offset = node._x;
  var totalX = 0;
  var children = node.children.map(function(child) {
    child = _.clone(child);
    child._x = offset + Template.flameBar.getWidth.call(node, totalX);
    totalX += child.totalHitCount;
    return child;
  });

  return children;
};

FlameViewer.prototype._handleEvents = function(type) {
  var methods = {
    'hover': "onHover",
    'click': "onClick"
  };
  return function(e) {
    var id = $(e.target).data('id');
    var methodName = methods[type];
    if(this[methodName]) {
      this[methodName](id, this.cpuProfile.functionsMap[id]);
    }
  }.bind(this);
};