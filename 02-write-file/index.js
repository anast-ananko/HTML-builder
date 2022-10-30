const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writableStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

process.on('SIGINT', () => {
  prosess.exit();
});

function writeFile() {
  rl.question('Write message    ', (answer) => {

    if (answer.toLocaleLowerCase().trim() === 'exit') {
      rl.close();
      return;
    }

    writableStream.write(answer + '\n', (err) => {
      if (!err) {
        writeFile();
      } else {
        process.stdout.write(err.message);
      }
    });

  });  
}

process.on('exit', () => process.stdout.write('\nBye!'));
//rl.on('close', () => process.stdout.write('\nBye!'));
writeFile();