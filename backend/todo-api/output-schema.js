const fs = require('fs');
const path = require('path');
var { introspectionQuery } = require('graphql'); 

const handler = require('./dist').schemaGenHandler;

const outputPath = '../../schema.json';

handler({
    query: introspectionQuery
}, null, function (err, res) {
    if (res.errors) {
        console.log(res.errors);
    } else {
        fs.writeFileSync(
            path.join(__dirname, outputPath), // writes to frontend folder
            JSON.stringify(res, null, 2)
        );
        console.log(path.join(__dirname, outputPath));        
    }
});