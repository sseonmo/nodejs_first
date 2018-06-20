let fs = require('fs');

//read File Sync
/*
console.log('A');
let result = fs.readFileSync('./syntax/sample.txt','utf8');
console.log(result);
console.log('C');
*/

console.log('A');
fs.readFile('./syntax/sample.txt','utf8', (err, result) => {
	console.log(result);
});
console.log('C');