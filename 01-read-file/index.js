const fs = require('fs');
const filePath = '01-read-file/text.txt';
const output = fs.createReadStream(filePath, 'utf-8');
output.on('data', (chunk) => console.log(chunk));
output.on('error', (error) => console.log('Error:', error.message));
