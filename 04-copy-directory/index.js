const { mkdir, readdir, copyFile, access, unlink } = require('fs/promises');
const { constants } = require('fs');
const path = require('path');

async function copy(sourceFolder, dectinationFolder) {  
  const filesInSourceFolder = await readdir(sourceFolder);  

  for (let item of filesInSourceFolder) {
    const sourceFile = path.join(sourceFolder, item);
    const dectionationFile = path.join(dectinationFolder, item);

    await copyFile(sourceFile, dectionationFile);
  }  
}

async function isFolderExist(dectinationFolder) {
  try {
    await access(dectinationFolder, constants.R_OK);
    return true; 
  } catch {
    return false;
  }
}

async function copyDirectory() {
  const sourceFolder = path.join(__dirname, 'files');
  const dectinationFolder = path.join(__dirname, 'files-copy');

  const isExist = await isFolderExist(dectinationFolder);

  if (isExist) {
    const filesInDectinationFolder = await readdir(dectinationFolder);
    
    for (let item of filesInDectinationFolder) {
      const dectionationFile = path.join(dectinationFolder, item);
      await unlink(dectionationFile);
    }
  
  } 
  
  await mkdir(dectinationFolder, {recursive: true});  

  copy(sourceFolder, dectinationFolder);
}

copyDirectory();