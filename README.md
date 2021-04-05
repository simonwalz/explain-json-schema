# Explain JSON schema

This project allows to convert a [JSON Schema](https://json-schema.org) to native english text.

Examples:

  * [Configuration osiota ArtNet app](test/010-example-artnet.md)
  * [Configuration osiota Modbus app](test/011-example-modbus.md)

### Supported JSON schema features

  * Basic attributes:
    * enum, const
    * deprecated
    * $ref locally
  * number, integer
    * minimum, maximum, exclusiveMinimum, exclusiveMaximum
    * multipleOf
  * string
    * minLength, maxLength
    * format
    * pattern
    * contentMediaType
    * contentEncoding
  * boolean
  * null
  * object
    * properties
    * additionalProperties (as boolean and as object)
    * patternProperties
    * required
    * minProperties, maxProperties
    * propertyNames.pattern
  * array
    * items (schema)
    * items (array of schemas)
    * minItems, maxItems
    * uniqueItems
    * contains
    * minContains, maxContains
  * allOf, oneOf, anyOf, not
  * if, then, else
  * multiple types (`type: ["string", "null"]`)


### Missing JSON schema features

  * object: dependencies (Properties and Schema)

## Install & Usage

```sh
npm install explain-json-schema
```

Run:

```sh
npx explain-json-schema --schema schema.json >TEXT.md
```


## Use as lib:

See `cli.js`


## License

This software is released under the MIT license.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
