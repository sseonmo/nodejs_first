let args = process.argv;
console.log(args);
/* output	3번째 부터 사용자 입력 아규먼트가 들어온다.
[ 'C:\\Program Files\\nodejs\\node.exe',					=> node runtime path
  'D:\\individual\\study\\nodejs\\syntax\\condition' ]		=> 실행된 file path
*/



console.log('A');
console.log('B');

if(args[2] === '1')	console.log('C1');
else		console.log('C2');

console.log('D');