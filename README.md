#json-collections

A simple meteor package that hooks into the bundler.

- Parses any files with the extension *`*.collection_name.collection.json`*
- Your data is available on the client and/or server (depending on where you put your json files)
- Access the data like this `var MyCollection = JSONCollections._collection_name`
- Then just use normal Mongo commands: `MyCollection.find().fetch()`