var baseColors = [
  [207, 169, 239],
  [227, 190, 234],
  [185, 223, 239],
  [206, 214, 232]
];

Template.flameBar.hasChildren = function() {
  return this.children && this.children.length > 0;
};

Template.flameBar.getWidth = function(w) {
  return Math.floor((this.viewer.width/this.viewer._maxWidth) * w);
};

Template.flameBar.getColor = function() {
  var pickIndex = Math.floor(Math.random() * baseColors.length)
  var baseColor = EJSON.clone(baseColors[pickIndex]);

  return "rgb(" + baseColor.join(",") + ")";
};

Template.flameBar.getFunctionName = function() {
  var functionNameWidth = 8 * this.functionName.length;
  var barWidth = Template.flameBar.getWidth.call(this, this.totalHitCount);
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
