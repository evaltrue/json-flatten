json-flatten
============

Flatten / Un-flatten JSON [serializable] objects

Object keys cannot start with a number, contain a period (.), or be empty strings ("").

Examples:
```javascript
JSON.flatten({foo:"bar"})
{"foo":"bar"}
JSON.flatten({foo:"bar",bar:[]})
{"foo":"bar","bar":[]}
JSON.flatten([{foo:"bar"}])
{"0.foo":"bar"}
JSON.flatten([1,{foo:"bar"},null,false,""])
{"0":1,"2":null,"3":false,"4":"","1.foo":"bar"}
JSON.flatten({nest:{nest:[{nest:true}]}})
{"nest.nest.0.nest":true}
```
