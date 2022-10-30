const { readdir, readFile, stat } = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function writeFile(filePath, writableStream) {
  try {
    const content = await readFile(filePath);

    writableStream.write(content + '\n');
  } 
  catch (err) {
    process.stdout.write(err.message);
  }
}

async function mergeStyles() {
  const sourceFolder = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const writableStream = fs.createWriteStream(bundlePath);

  try {
    const filesInSourceFolder = await readdir(sourceFolder);

    for (let item of filesInSourceFolder) {
      const filePath = path.join(sourceFolder, item);

      const fileStat = await stat(filePath);

      if (fileStat.isFile() && (path.extname(filePath) === '.css')) {
        writeFile(filePath, writableStream);
      }
    }

  } catch (err) {
    process.stdout.write(err.message);
  }
}

mergeStyles();