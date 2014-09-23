var profile = new CPUProfile(SampleProfile);
profile.process();

data = profile.paths[4];
// data = {
//   totalHitCount: 100,
//   _depth: 0,
//   children: [
//     {totalHitCount: 60, _depth: 1, 
//       children: [
//         {totalHitCount: 30, _depth: 2}
//       ]
//     },
//     {totalHitCount: 40, _depth: 1, 
//       children: [
//         {totalHitCount: 10, _depth: 2}
//       ]
//     },
//   ]
// };
dataChanged.changed();

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