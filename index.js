
var isObject = function(object) {
	return typeof object === "object" && object !== null;
}

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
			if (e.toString().includes("    "+sep) && word == "or "){
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
var global_schema = null;
var getref = function(object) {
	if (typeof object['$ref'] === "string") {
		var o = global_schema;
		var path = object['$ref'].replace(/^#\//, '');
		path.split(/\//)
				.forEach(function(p) {
			o = o[p];
		});
		o.path = path;
		return o;
	}
	return object;
};

var explain = function(element, depth) {
	if (global_schema == null) {
		global_schema = element;
		var re = explain(element, depth);
		global_schema = null;
		return re;
	}
	element = getref(element);
	if (typeof depth !== "number") depth = 0;
	var r = [];
	if (element.deprecated === true) {
		var rr = "is deprecated";
		r.push(rr);
	}
	// const
	if (typeof element.const !== "undefined") {
		r.push("is `" + element.const + "` ");
		return r.conjunction("and ", depth, true);
	}
	// enum
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
	// type
	if (typeof element.type == "string") {
		let rr = "is of type `"+element.type + "` ";
		r.push(rr);
	}
	if (Array.isArray(element.type)) {
		let rr = "is of type "+element.type.map(e=>"`"+e+"`")
				.conjunction("or ", depth+1) + " ";
		r.push(rr);
	}
	// number
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
		var rr = "has *" + element.format + "* format ";
		r.push(rr);
	}
	if (typeof element.pattern === "string") {
		var rr = "matches pattern `" + element.pattern + "` ";
		r.push(rr);
	}
	if (typeof element.minLength === "number") {
		var rr = "is at least " + element.minLength + " characters long ";
		r.push(rr);
	}
	if (typeof element.maxLength === "number") {
		var rr = "is not longer than " + element.maxLength + " characters ";
		r.push(rr);
	}
	if (typeof element.contentMediaType === "string") {
		var rr = "has a media type of `" + element.contentMediaType +
				"`";
		r.push(rr);
	}
	if (typeof element.contentEncoding === "string") {
		var rr = "has a media type of `" + element.contentEncoding +
				"`";
		r.push(rr);
	}

	// object: properties
	var prefix = "has ";
	if (isObject(element.properties) || isObject(element.patternProperties)
			|| isObject(element.propertyNames)){
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
	}
	if (isObject(element.propertyNames) &&
			typeof element.propertyNames.pattern === "string") {
		var rr = prefix + "all property names match `" +
				element.propertyNames.pattern + "` ";
		prefix = "";
		r.push(rr);
	}
	if (isObject(element.properties)) {
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
			var rr = explain(ep, depth+1);
			if (rr === null || rr === "") return null;
			prefix = "";
			return r+rr;
		}).conjunction("and ", depth);
		r.push(rr);
	}
	// object: patternProperties
	if (isObject(element.patternProperties)) {
		var rr = Object.keys(element.properties).map(function(prop) {
			var ep = element.properties[prop];
			var r = prefix;
			r += "the property key name matches `" + prop + "` and the value ";
			var rr = explain(ep, depth+1);
			if (rr === null || rr === "") return null;
			prefix = "";
			return r+rr;
		}).conjunction("and ", depth);
		r.push(rr);
	}
	// array: items
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
		rr += "items, where<br/>";
		element.items.forEach(function(item, i) {
			rr += "the "+count(i+1)+" item ";
			rr += explain(item, depth+1);
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
		rr += explain(element.items, depth+1);

		r.push(rr);
	}
	// array: contains
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
		rr += explain(element.contains, depth+1);

		r.push(rr);
	}

	// oneOf / anyOf / allOf / not
	if (Array.isArray(element.anyOf)) {
		var rr = element.anyOf.map(e=>explain(e, depth+1)).conjunction("or ", depth);
		if (rr) r.push("either " + rr);
	}
	if (Array.isArray(element.oneOf)) {
		var rr = element.oneOf.map(e=>explain(e, depth+1)).conjunction("or ", depth);
		if (rr) r.push("either " + rr);
	}
	if (Array.isArray(element.allOf)) {
		var rr = element.allOf.map(e=>explain(e, depth+1)).conjunction("and ", depth)
		if (rr) r.push("all of " + rr);
	}
	if (isObject(element.not)) {
		var rr = explain(element.not, depth+1);
		if (!rr) return "never";
		else if (rr !== "never") r.push("never " + rr);
	}

	// object: additionalProperties
	if (element.additionalProperties === false) {
		r.push("has no more properties ");
	} else if (isObject(element.additionalProperties)) {
		var rr = explain(element.additionalProperties, depth+1);
		r.push("each additional property" + rr);
	}

	return r.conjunction("and ", depth);
}


exports.explain = explain;
