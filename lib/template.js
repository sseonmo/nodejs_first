let fs 		= require('fs');

module.exports = {
	html: function (title, list, body, control) {	//제목, ul tag, 본문, button 영역
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
	,

	list: function () {
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
};

// module.exports = template;