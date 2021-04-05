#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const fs = require("fs");

var isObject = function(object) {
	return typeof object === "object" && object !== null;
}

var schema = JSON.parse(fs.readFileSync(argv.schema));

var count = function(i) {
	if (i === 1) return "1th";
	if (i === 2) return "2nd";
	if (i === 3) return "3rd";
	return i+"th";
}

var not_null = function(prop) {
	return prop !== null;
};

Array.prototype.conjunction = function(word, depth, less_lines) {
	if (!this.length) return null;
	if (typeof depth !== "number") depth = 0;
	var sep = "  ".repeat(depth+1)+"* ";
	var r = this.filter(not_null).map(function(e, i, arr) {
		if (less_lines && arr.length === 1) {
			return e;
		}
		if (i !== arr.length-1) {
			//console.error(depth, word, "E", "x\n"+"    "+sep+"x", e,
			//	e.toString().includes("    "+sep));
			if (e.toString().includes("    "+sep)) {
				e += "\n"+sep + word;
			} else if (e.toString().includes("  "+sep)) {
				e += ", " + word;
			} else {
				e += word;
			}
		}
		if (e[0] !== "\n") e = "\n"+sep + e;
		return e;
	});
	if (!r.length) return null;
	return r.join("");
};

var parse_if = function(element, depth) {
	if (typeof depth !== "number") depth = 0;
	var r = [];
//verb = "is"
	if (element.deprecated === true) {
		var rr = "is deprecated";
		r.push(rr);
	}
	//const
	if (typeof element.const !== "undefined") {
		r.push("is `" + element.const + "` ");
		return r.conjunction("and ", depth, true);
	}
	//enum
	else if (Array.isArray(element.enum)) {
		if (element.enum.length === 0) {
			return "never";
		} else if (element.enum.length === 1) {
			r.push("is `" + element.enum[0] + "` ");
			return r.conjunction("and ", depth, true);
		} else {
			r.push(element.enum.map(e=>'is `'+e+'` ').conjunction("or ", depth));
			return r.conjunction("and ", depth);
		}
	}
	//type
	if (typeof element.type == "string") {
		let rr = "is of type `"+element.type + "` ";
		r.push(rr);
	}
	if (Array.isArray(element.type)) {
		let rr = "is of type "+element.type.map(e=>"`"+e+"`")
				.conjunction("or ", depth+1) + " ";
		r.push(rr);
	}
	//number
	var rwhere = [];
	if (typeof element.minimum === "number") {
		var rr = "is at least " + element.minimum + " ";
		rwhere.push(rr);
	}
	if (typeof element.exclusiveMinimum === "number") {
		var rr = "is larger than " + element.exclusiveMinimum + " ";
		rwhere.push(rr);
	}
	if (typeof element.maximum === "number") {
		var rr = "is not larger than " + element.maximum + " ";
		rwhere.push(rr);
	}
	if (typeof element.exclusiveMaximum === "number") {
		var rr = "is lower than " + element.exclusiveMaximum + " ";
		rwhere.push(rr);
	}
	if (typeof element.multipleOf === "number") {
		var rr = "is a multiple of " + element.multipleOf + " ";
		rwhere.push(rr);
	}
	if (rwhere.length) {
		r.push("has a numeric value that " + rwhere.conjunction("and ", depth+1));

	}
	// string
	if (typeof element.format === "string") {
		var rr = "has *" + element.format + "* format";
		rwhere.push(rr);
	}
	if (typeof element.pattern === "string") {
		var rr = "matches pattern `" + element.pattern + "` ";
		rwhere.push(rr);
	}
	if (typeof element.minLength === "number") {
		var rr = "is at least " + element.minLength + " characters long ";
		rwhere.push(rr);
	}
	if (typeof element.maxLength === "number") {
		var rr = "is not longer than " + element.maxLength + " characters ";
		rwhere.push(rr);
	}
	if (typeof element.contentMediaType === "string") {
		var rr = "has a media type of `" + element.contentMediaType +
				"`";
		rwhere.push(rr);
	}
	if (typeof element.contentEncoding === "string") {
		var rr = "has a media type of `" + element.contentEncoding +
				"`";
		rwhere.push(rr);
	}

// has ... that is | and ... is
	// properties
	if (isObject(element.properties)) {
		var prefix = "has ";
		if (typeof element.minProperties === "number") {
			prefix += "at least " + element.minProperties + " ";
			if (typeof element.maxProperties === "number") {
				prefix += "but ";
			}
		}
		if (typeof element.maxProperties === "number") {
			prefix += "not more than " + element.maxProperties + " ";
		}
		prefix += "properties, where<br/>";
		var rr = Object.keys(element.properties).map(function(prop) {
			var ep = element.properties[prop];
			var r = prefix;
			if (Array.isArray(element.required)) {
				if (element.required.includes(prop)) {
					r += "required ";
				} else {
					r += "optional ";
				}
			}
			r += "property **" + prop + "** ";
			var rr = parse_if(ep, depth+1);
			if (rr === null || rr === "") return null;
			prefix = "";
			return r+rr;
		}).conjunction("and ", depth);
		r.push(rr);
		if (element.additionalProperties === false) {
			r.push("not any more properties ");
		} else if (isObject(element.additionalProperties)) {
			var rr = parse_if(element.additionalProperties, depth+1);
			r.push("each additional property" + rr);
		}
	}
// contains | and it contains
	//is of type array and each item
	if (Array.isArray(element.items)) {
		let rr = "has "
		if (typeof element.minItems === "number") {
			rr += "at least " + element.minItems + " ";
			if (typeof element.maxItems === "number") {
				rr += "but ";
			}
		}
		if (typeof element.maxItems === "number") {
			rr += "not more than " + element.maxItems + " ";
		}
		if (element.uniqueItems === true) {
			rr += "unique ";
		}
		rr += "items, where ";
		element.items.forEach(function(item, i) {
			rr += "the "+count(i+1)+" item ";
			rr += parse_if(item, depth+1);
			r.push(rr);
			rr = "";
		});
	}
	else if (isObject(element.items)) {
		let rr = "has "
		if (typeof element.minItems === "number") {
			rr += "at least " + element.minItems + " ";
			if (typeof element.maxItems === "number") {
				rr += "but ";
			}
		}
		if (typeof element.maxItems === "number") {
			rr += "not more than " + element.maxItems + " ";
		}
		rr += "items, where every item ";
		rr += parse_if(element.items, depth+1);

		r.push(rr);
	}
	//contains
	if (isObject(element.contains)) {
		let rr = "contains "
		if (typeof element.minContains === "number") {
			rr += "at least " + element.minContains + " ";
			if (typeof element.maxContains === "number") {
				rr += "but ";
			}
		}
		if (typeof element.maxContains === "number") {
			rr += "not more than " + element.maxContains + " ";
		}
		rr += "items, where every item ";
		rr += parse_if(element.contains, depth+1);

		r.push(rr);
	}

	// oneOf / anyOf
	if (Array.isArray(element.anyOf)) {
		var rr = element.anyOf.map(e=>parse_if(e, depth+1)).conjunction("or ", depth);
		if (rr) r.push("either " + rr);
	}
	if (Array.isArray(element.oneOf)) {
		var rr = element.oneOf.map(e=>parse_if(e, depth+1)).conjunction("or ", depth);
		if (rr) r.push("either " + rr);
	}
	if (Array.isArray(element.allOf)) {
		var rr = element.allOf.map(e=>parse_if(e, depth+1)).conjunction("and ", depth)
		if (rr) r.push("all of " + rr);
	}
	if (isObject(element.not)) {
		var rr = parse_if(element.not, depth+1);
		if (!rr) r.push("never");
		else if (rr !== "never") r.push("not " + rr);
	}
	return r.conjunction("and ", depth);
}

var parse_allof = function(element, p_element) {
	if (isObject(element.if)) {
		var element_name = "the element";
		console.log("if "+element_name+"\n" +
				parse_if(element.if));
		console.log("\nthen:\n");
	}
}

if (Array.isArray(schema.allOf)) {
	schema.allOf.forEach(parse_allof, schema);
}

console.log(
	"The configuration is valid, if it\n" +
	parse_if(schema)
);
