var fs = require('fs');
var Validator = require('jsonschema').Validator;
var v = new Validator();

function isValidJSON(schemaPath, inputFile, schemaID) {
    var schema = require(schemaPath); //path of JSON schema
    var input = require(inputFile); // path of JSON to be validated.

    v.addSchema(schema, schemaID);
    var result = v.validate(input, schema);
    if (result.errors.length > 0) {
        console.log('Error in JSON. Please check the JSON');
        for (valerr in result.errors) {
            console.log('* ' + result.errors[valerr].stack);
        }
        return false;
    } else {
        console.log('Success!');
        return true;
    }
}

exports.isValidJSON = isValidJSON
