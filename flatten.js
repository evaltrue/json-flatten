// flatten.js - http://github.com/evaltrue/json-flatten
// 
(function() {
"use strict";
JSON.unflatten = function(data) {
    if (Object(data) !== data || Array.isArray(data))
        return data;
    if ("" in data)
        return data[""];
    var result = {}, cur, prop, idx, last, temp;
    for(var p in data) {
        cur = result, prop = "", last = 0;
        do {
            idx = p.indexOf(".", last);
            temp = p.substring(last, idx !== -1 ? idx : undefined);
            cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
            prop = temp;
            last = idx + 1;
        } while(idx >= 0);
        cur[prop] = data[p];
    }
    return result[""];
}
JSON.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop ? prop+"."+i : ""+i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}
})();
/*
function testJsonFlatten() {
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten("")), null, "\t"));
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten([])), null, "\t"));
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten({})), null, "\t"));
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten("test")), null, "\t"));
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten(123)), null, "\t"));
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten(null)), null, "\t"));
  var demo1 = {
    a: 1,
    b: ["bbb", [1,2,3], {x: "y"}],
    c: "ccc",
    d: -99,
    e: { a: { b: 23 }, b: [123], c: "dd" }
  };
  var demo2 = [0,[1],[2,[3,4],5],[6],7];
  console.log(JSON.stringify(JSON.flatten(demo1), null, "\t"));
  console.log(JSON.stringify(JSON.flatten(demo2), null, "\t"));
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten(demo1)), null, "\t"));
  console.log(JSON.stringify(JSON.unflatten(JSON.flatten(demo2)), null, "\t"));
};testJsonFlatten();
*/
