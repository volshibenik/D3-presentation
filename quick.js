let quick = (function (){
var n = 60,
array = d3.shuffle(d3.range(n)),
actions = quicksort(array.slice()).reverse();

var margin = {top: 130, right: 40, bottom: 230, left: 40},
width = 960 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
.domain(d3.range(n))
.rangePoints([0, width]);

var a = d3.scale.linear()
.domain([0, n - 1])
.range([-45, 45]);


var svg = d3.select(".quick-sort").html('').append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var line = svg.append("g")
.attr("class", "line")
.selectAll("line")
.data(array)
.enter().append("line")
.attr("transform", transform)
.attr("y2", -height);

var transition = d3.transition()
.duration(280)
.each("start", function start() {
  var action = actions.pop();
  switch (action.type) {
    case "swap": {
      var i = action[0],
          j = action[1],
          li = line[0][i],
          lj = line[0][j];
      line[0][i] = lj;
      line[0][j] = li;
      transition.each(function() { line.transition().attr("transform", transform); });
      break;
    }
    case "partition": {
      line.attr("class", function(d, i) {
        return i === action.pivot ? "line--pivot"
            : action.left <= i && i < action.right ? null
            : "line--inactive";
      });
      break;
    }
  }
  if (actions.length) transition = transition.transition().each("start", start);
  else transition.each("end", function() { line.attr("class", null); });
});

function transform(d, i) {
return "translate(" + x(i) + "," + height + ")rotate(" + a(d) + ")";
}

function quicksort(array) {
var actions = [];

function partition(left, right, pivot) {
var v = array[pivot];
swap(pivot, --right);
for (var i = left; i < right; ++i) if (array[i] <= v) swap(i, left++);
swap(left, right);
return left;
}

function swap(i, j) {
if (i === j) return;
var t = array[i];
array[i] = array[j];
array[j] = t;
actions.push({type: "swap", "0": i, "1": j});
}

function recurse(left, right) {
if (left < right - 1) {
  var pivot = (left + right) >> 1;
  actions.push({type: "partition", "left": left, "pivot": pivot, "right": right});
  pivot = partition(left, right, pivot);
  recurse(left, pivot);
  recurse(pivot + 1, right);
}
}

recurse(0, array.length);
return actions;
}
})
