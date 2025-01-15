const fs = require('fs');
const { stdin, stdout } = process;
const filePath = '02-write-file/text.txt';
const output = fs.createWriteStream(filePath);
stdout.write('write to me that the night is dark \n');
stdin.on('data', (data) => {
  const input = data.toString().trim().toLowerCase();
  if (input === 'exit') {
    stdout.write('Good luck learning Node.js!');
    process.exit();
  }
  output.write(data);
});

process.on('SIGINT', () => {
  console.log('Good luck learning Node.js!');
  process.exit();
});
