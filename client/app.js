data = buildData();

function buildData() {
  return [
    {value: 100},
    {value: 200},
    {value: 300},
  ].map(function(d, index) {
    d.index = index,
    d.storkeWidth = 0.1
    return d;
  });
}

dataChanged = new Tracker.Dependency();

Template.graph.data = function() {
  dataChanged.depend();
  return data;
};

lastSelectedItem = null;
Template.graph.events({
  "mouseover rect": function(el) {
    if(lastSelectedItem) {
      lastSelectedItem.storkeWidth = "0.1";
    }
    
    this.storkeWidth = "1";
    lastSelectedItem = this;

    dataChanged.changed();
  }
});

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

Blaze.registerHelper('add', function(a, b) {
  return a + b;
});