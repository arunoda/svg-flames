data = [];
dataChanged = new Tracker.Dependency();
width = 1000;
var maxWidth = width;
var baseColors = [
  [207, 169, 239],
  [227, 190, 234],
  [185, 223, 239],
  [206, 214, 232]
];

function buildSvg() {

}

Template.graph.data = function() {
  maxWidth = data.totalHitCount;
  data._x = 0;
  return data;
};

Template.graphBar.hasChildren = function() {
  return this.children && this.children.length > 0;
};

Template.graphBar.getWidth = function(w) {
  return Math.floor((width/maxWidth) * w);
};

Template.graphBar.getColor = function() {
  var pickIndex = Math.floor(Math.random() * baseColors.length)
  var baseColor = EJSON.clone(baseColors[pickIndex]);

  return "rgb(" + baseColor.join(",") + ")";
};

Template.graphBar.getChildren = function() {
  if(Blaze.currentView && Blaze.currentView.parentView) {
    var parent = Blaze.getData(Blaze.currentView.parentView);
  }

  var offset = (parent)? parent._x : 0;
  var totalX = 0;
  var children = this.children.map(function(child) {
    child = _.clone(child);
    child._x = offset + Template.graphBar.getWidth(totalX);
    totalX += child.totalHitCount;
    return child;
  });

  return children;
};

Template.graphBar.getFunctionName = function() {
  var functionNameWidth = 12 * this.functionName.length;
  var barWidth = Template.graphBar.getWidth(this.totalHitCount);
  if(barWidth > functionNameWidth) {
    return this.functionName;
  }
};

Blaze.registerHelper('expr', function(a) {
  var self = this;
  var parts = a.split(" ").map(function(val) {
    if(typeof self[val] != "undefined") {
      return self[val];
    } else {
      return val;
    }
  });

  return eval(parts.join(" "));
});
