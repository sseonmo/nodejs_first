// module
let http = require('http');
let fs = require('fs');
let url = require('url');

var app = http.createServer(function (request, response) {
	let _url = request.url;
	let queryData = url.parse(_url, true).query;	//querystring 추출
	let pathname = url.parse(_url, true).pathname;	//querystring를 포함하지 않음.
	let title = queryData.id;

	// console.log(url.parse(_url, true));
	// console.log('filepath : ', `data/${queryData.id}`);

	if(pathname === '/'){

		if(!Boolean(queryData.id)){
			title = 'Welcome';
			let description ='Hello, Node.js';

			let template = `
					<!doctype html>
						<html>
						<head>
						  <title>WEB1 - ${title}</title>
						  <meta charset="utf-8">
						</head>
						<body>
						  <h1><a href="/">WEB</a></h1>
						  <ul>
							<li><a href="/?id=HTML">HTML</a></li>
							<li><a href="/?id=CSS">CSS</a></li>
							<li><a href="/?id=javascript">JavaScript</a></li>
						  </ul>
						  <h2>${title}</h2>
						  </p>${description}</p>
						</body>
						</html>
					`;
			response.writeHead(200);
			response.end(template);
		}
		else{
			fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description) => {
				// console.log(description);
				let template = `
					<!doctype html>
						<html>
						<head>
						  <title>WEB1 - ${title}</title>
						  <meta charset="utf-8">
						</head>
						<body>
						  <h1><a href="/">WEB</a></h1>
						  <ul>
							<li><a href="/?id=HTML">HTML</a></li>
							<li><a href="/?id=CSS">CSS</a></li>
							<li><a href="/?id=javascript">JavaScript</a></li>
						  </ul>
						  <h2>${title}</h2>
						  </p>${description}</p>
						</body>
						</html>
					`;
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
