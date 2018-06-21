// module
let http 	= require('http');
let fs 		= require('fs');
let url 	= require('url');
let qs 		= require('querystring');

//제목, ul tag, 본문, button 영역
function templateHTML(title, list, body, control){
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
				  ${control}
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

	if(pathname === '/')
	{

		if(!Boolean(queryData.id))	// 홈화면
		{
			title = 'Welcome';
			let description ='Hello, Node.js2';

			let template = templateHTML(title, templateList()
				, `<h2>${title}</h2></p>${description}</p>`
				, `<a href="/create">Create</a>`);

			response.writeHead(200);
			response.end(template);

		}
		else	//상세화면
		{
			fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
				// console.log(description);
				let template = templateHTML(title, templateList()
					, `<h2>${title}</h2></p>${description}</p>`
					, `<a href="/update?id=${title}">update</a> 
						<form action="/delete_process" method="post" onsubmit="return confirm('삭제하시겠습니까?');">
							<input type="hidden" name="id" value="${title}">
							<input type="submit" value="delete">
						</form>`);
				response.writeHead(200);
				response.end(template);
			});
		}
	}
	else if(pathname === '/create')	//등록폼
	{
		title = 'Create';
		let formHtml = `
			<form method="post" action="/create_process" >
				<p><input type="text" name="title" placeholder="title"></p>
				<p>
					<textarea name="description" placeholder="description"></textarea>
				</p>
				<p>
					<input type="submit" value="submit">
				</p>
			</form>
		`;

		let template = templateHTML(title, templateList(), `${formHtml}`, '');

		response.writeHead(200);
		response.end(template);
	}
	else if(pathname === '/create_process')	//등록프로세스
	{
		let body = '';

		//post 데이터 수신
		request.on('data', (data) =>{
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 1e6)	request.connection.destroy();
		});

		// 수신완료 후 호출됨
		request.on('end', () => {
			let post = qs.parse(body);
			let title = post.title;
			let description = post.description;

			fs.writeFile(`data/${title}`, description, 'utf8', (err) =>{

				// 302 - redirection
				response.writeHead(302, {Location: `/?id=${title}`});	//redirection
				response.end();
			});
		});

	}
	else if(pathname === '/update')	//수정폼
	{
		fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
			// console.log(description);
			let template = templateHTML(title, templateList()
				, `
					<form method="post" action="/update_process" >
						<input type="hidden" name="id" value="${queryData.id}" >
						<p><input type="text" name="title" value="${queryData.id}" ></p>
						<p>
							<textarea name="description" placeholder="description">${description}</textarea>
						</p>
						<p>
							<input type="submit" value="submit">
						</p>
					</form>
				`
				,'');
			response.writeHead(200);
			response.end(template);
		});

	}
	else if(pathname === '/update_process')	//수정프로세스
	{
		let body = '';

		//post 데이터 수신
		request.on('data', (data) =>{
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 1e6)	request.connection.destroy();
		});

		// 수신완료 후 호출됨
		request.on('end', () => {
			let post = qs.parse(body);
			let id = post.id;
			let title = post.title;
			let description = post.description;

			// file rename, content 변경
			fs.rename(`data/${id}`, `data/${title}`, (err) => {
				fs.writeFile(`data/${title}`, description, 'utf8', (err) =>{	//파일생성 - 파일이 있다면 대체한다.

					// 302 - redirection
					response.writeHead(302, {Location: `/?id=${title}`});		//redirection
					response.end();
				});
			});

			/* 삭제 후 생성
			fs.unlink(`data/${id}`, (err) => console.log(err));				//파일삭제
			fs.writeFile(`data/${title}`, description, 'utf8', (err) =>{	//파일생성

				// 302 - redirection
				response.writeHead(302, {Location: `/?id=${title}`});		//redirection
				response.end();
			});
			*/
		});
	}
	else if(pathname === '/delete_process')
	{
		let body = '';

		//post 데이터 수신
		request.on('data', (data) =>{
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 1e6)	request.connection.destroy();
		});

		// 수신완료 후 호출됨
		request.on('end', () => {
			let post = qs.parse(body);
			let id = post.id;

			//파일삭제
			fs.unlink(`data/${id}`, (err) => {
				console.log('file delete');
				response.writeHead(302, {Location: '/'});		//redirection
				response.end();
			});


		});
	}
	else
	{
		response.writeHead(404);
		response.end('Not found');
	}

});

app.listen(3000);
