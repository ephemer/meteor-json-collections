var path = Npm.require('path');

// Read files matching '*.collection_name.collection.json':
var fileExtension = "collection.json";


// Make them available via local collection, depending on folder path (client, server, etc.):
Plugin.registerSourceHandler(fileExtension, function (compileStep) {

	// ------------------------------------------------------------------------
	// Read the JSON data from our file (make sure it validates):

	try {
		var jsonString = compileStep.read().toString('utf8');
		var jsonAsObject = JSON.parse(jsonString);
	} catch (e) {
		jsonAsObject = null;
	}

	// If there was an error parsing the JSON, bail out
	if (!jsonAsObject) {
		compileStep.error({
			sourcePath: compileStep.inputPath,
			message: "Error parsing the JSON data to put into your collection"
		});
		return;
	}


	// -------------------------------------------------------------------------
	// Cleanup pathnames and decide which collection the data belongs in

	var path_part = path.dirname(compileStep.inputPath);
	if (path_part === '.')
		path_part = '';
	if (path_part.length && path_part !== path.sep)
		path_part = path_part + path.sep;

	var basename = path.basename(compileStep.inputPath, '.' + fileExtension);


	// Get the name of the collection the user is adding the data to:
	var collectionName = path.extname(basename);
	if (collectionName.indexOf('.') !== 0) {
		// No collection name included in file path, fail with the following error:
		compileStep.error({
			sourcePath: compileStep.inputPath,
			message: "You need to name the collection you want to add your JSON to."
				   + "\n\tUse the format __filename.collection_name.collection.json__"
		});
		return;
	}


	// -------------------------------------------------------------------------
	// Prepare our output (it has to be a __String__):

	var output = [
		"if (typeof JSONCollections !== 'object') JSONCollections = {};",
		"if (typeof JSONCollections" + collectionName + " !== 'object') {",
		"	JSONCollections" + collectionName + " = new Mongo.Collection(null);",
		"}"
	];

	if (jsonAsObject.length) { // array
		jsonAsObject.forEach(addToOutputArray);
	} else {
		addToOutputArray(jsonAsObject);
	}

	function addToOutputArray(obj) {
		output.push("JSONCollections" + collectionName + ".insert(" + JSON.stringify(obj) + ");");
	}

	// Add it to the app bundle:
	compileStep.addJavaScript({
		path: basename + "." + fileExtension,
		sourcePath: compileStep.inputPath,
		data: output.join('\n')
	});

});