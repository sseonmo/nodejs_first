const testFolder = './data/';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {

	console.log(files);
	files.forEach(f => {
		console.log(f);
	});
});