dataChanged = new Tracker.Dependency();
width = 1000;
var maxWidth = width;
var baseColors = [
  [207, 169, 239],
  [227, 190, 234],
  [185, 223, 239],
  [206, 214, 232]
];

Meteor.startup(function() {
  var svgHtml = "";
  var baseData = getData();
  renderNode(baseData, null);

  $('#graph-svg').html("<svg width='1000' height='1000'>" + svgHtml + "</svg>");
  $('#graph-svg').on('click', 'rect, text', function(e) {
    console.log($(e.target).data('id'));
  });

  function renderNode(node) {
    svgHtml += Blaze.toHTMLWithData(Template.graphBar, node);

    if(node.children && node.children.length > 0) {
      var children = getChildren(node);
      children.forEach(function(child) {
        renderNode(child, node);
      });
    }
  }
});

function getData() {
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

function getChildren(node) {
  var offset = node._x;
  var totalX = 0;
  var children = node.children.map(function(child) {
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
