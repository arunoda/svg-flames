Meteor.startup(function() {
  var profile = new CPUProfile(SampleProfile);
  profile.process();

  flameViewer = new FlameViewer(profile, 'flame-graph', 800, 800);
  flameViewer.renderPath(4);
  flameViewer.onHover = function(id, node) {
    console.log(id, node.functionName, node.url);
  };

  // flameViewer.onClick = function(id, node) {
  //   console.log(id, node.functionName);
  // };
});