const fs = require('fs');

fs.readFile('sample.txt', 'utf-8',(err, data) => {
	// if(err)  throw err;
	console.log(data);
});

/*

var fs = require('fs');
fs.readFile('sample.txt',  function(err, data){
	console.log(data);
});
*/
