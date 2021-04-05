#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const fs = require("fs");
const explain_json_schema = require(".").explain;

var schema = JSON.parse(fs.readFileSync(argv.schema));

var valid = explain_json_schema(schema);
if (valid === null) {
	console.log("The schema is always valid.");
} else if (valid === "never") {
	console.log("The schema is never valid.");
} else {
	console.log("The schema is valid, if it\n" + valid);
}

/*
var parse_allof = function(element, p_element) {
	if (isObject(element.if)) {
		var element_name = "the element";
		console.log("if "+element_name+"\n" +
				explain(element.if));
		console.log("\nthen:\n");
	}
}

if (Array.isArray(schema.allOf)) {
	schema.allOf.forEach(parse_allof, schema);
}
*/

