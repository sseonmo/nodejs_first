// module
let http 	= require('http');
let fs 		= require('fs');
let url 	= require('url');

function templateHTML(title, list, body){
	return `
			<!doctype html>
				<html>
				<head>
				  <title>WEB1 - ${title}</title>
				  <meta charset="utf-8">
				</head>
				<body>
				  <h1><a href="/">WEB</a></h1>
				  ${list}
				  ${body}
				</body>
				</html>
			`;
}


function templateList(){
	// 동기
	let list = '<ul>';
	let files = fs.readdirSync('./data');

	files.forEach(f => {
		list += `<li><a href='/?id=${f}'>${f}</a></li>`;
	});

	return list += '</ul>';

	/*	비동기
		fs.readdir('./data', (err, files) => {
			console.log(files);
			files.forEach(f => {
				list += `<li><a href='/?id=${f}'>HTML</a></li>`;
			});
		});
	*/

}


var app = http.createServer(function (request, response) {
	let _url = request.url;
	let queryData = url.parse(_url, true).query;	//querystring 추출
	let pathname = url.parse(_url, true).pathname;	//querystring를 포함하지 않음.
	let title = queryData.id;

	if(pathname === '/'){

		if(!Boolean(queryData.id)){
			title = 'Welcome';
			let description ='Hello, Node.js2';

			let template = templateHTML(title, templateList(), `<h2>${title}</h2></p>${description}</p>`);

			response.writeHead(200);
			response.end(template);

		}
		else{
			fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
				// console.log(description);
				let template = templateHTML(title, templateList(), `<h2>${title}</h2></p>${description}</p>`);
				response.writeHead(200);
				response.end(template);
			});
		}
	}else{
		response.writeHead(404);
		response.end('Not found');
	}

});

app.listen(3000);
