// flatten.js - http://github.com/evaltrue/json-flatten

JSON.unflattenKey = function(str) {
  if(!str) return null;
  var result = {};
  result.name = str.replace(/\[\d+\]$/, "");
  result.index = -1;
  if(/\[\d+\]$/.test(str)) { // has index
    result.index = str.match(/\[(\d+)\]$/)[1];
  }
  return result;
}
JSON.unflatten = function(data) {
  if(data === null || typeof data !== "object" || Array.isArray(data)) { // empty array or primitive
    return data;
  }
  var result, temp;
  var first = null;
  for(var k in data) { first = k; break; };
  if(first === null) { // empty object
    return {};
  } else if(first.indexOf("[") === 0) { // array
    result = [];
  } else { // object
    result = {};
  }
  for(var k in data) {
    var value = data[k];
    var obj = result;
    var nameParts = k.split(".");
    var a, b;
    for(var i=0; i<nameParts.length; i++) {
      a = JSON.unflattenKey(nameParts[i]);
      b = JSON.unflattenKey(nameParts[i+1]);
      if(b !== null) { // part with lookahead
        if(a.index >= 0 && !a.name) { // raw array
          if(typeof obj[a.index] === "undefined") {
            obj[a.index] = (!b.name ? [] : {});
          }
          obj = obj[a.index];
        } else if(a.index >= 0 && a.name) { // named array
          if(typeof obj[a.name] === "undefined")
             obj[a.name] = [];
          if(typeof obj[a.name][a.index] === "undefined") {
            obj[a.name][a.index] = (!b.name ? [] : {});
          }
          obj = obj[a.name][a.index];
        } else if(a.index < 0 && a.name) { // nested object and property
          if(typeof obj[a.name] === "undefined") {
            obj[a.name] = (!b.name ? [] : {});
          }
          obj = obj[a.name];
        }
      } else { // last part
        if(a.index >= 0 && !a.name) { // raw array
          if(typeof obj[a.index] === "undefined")
            obj[a.index] = value;
        } else if(a.index >= 0 && a.name) { // named array
          if(typeof obj[a.name] === "undefined")
            obj[a.name] = [];
          if(typeof obj[a.name][a.index] === "undefined")
            obj[a.name][a.index] = value;
        } else if(a.index < 0 && a.name) { // nested object and property
          if(typeof obj[a.name] === "undefined")
            obj[a.name] = value;
        }
      }
    }
  }
  return result;
}
JSON.flatten = function(data) {
  var result = {};
  return JSON.flattenRec(data, result, "");
}
JSON.flattenRec = function(data, result, prefix) {
  var isEmpty = false, value;
  if(Array.isArray(data)) { // array
    for(var i=0; i<data.length; i++) {
      JSON.flattenRec(data[i], result, (prefix ? (/]$/.test(prefix) ? prefix + "." : prefix) : "") + "[" + i + "]");
    }
    isEmpty = data.length === 0;
    value = [];
  } else if(typeof data === "object" && data !== null) { // object
    var cnt = 0;
    for(var k in data) {
      cnt++;
      JSON.flattenRec(data[k], result, (prefix ? prefix + "." : "") + k);
    }
    isEmpty = cnt === 0
    value = {};
  } else { // primitive
    isEmpty = true;
    value = data;
  }
  if(isEmpty) {
    if(prefix)
      result[prefix] = value;
    else
      result = value;
  }
  return result;
}

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
