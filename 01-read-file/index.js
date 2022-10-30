const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath);

readableStream.pipe(process.stdout);
readableStream.on('error', (err) => {
    process.stdout.write(err.message);
})