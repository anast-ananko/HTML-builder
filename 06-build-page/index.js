const { mkdir, readdir, readFile, copyFile, unlink, stat, access } = require('fs/promises');
const fs = require('fs');
const { constants } = require('fs');
const path = require('path');

async function isFolderExist(dectinationFolder) {
  try {
    await access(dectinationFolder, constants.R_OK);
    return true; 
  } catch {
    return false;
  }
}

async function copy(sourceFolder, dectinationFolder) {  
  try {
    const filesInSourceFolder = await readdir(sourceFolder); 

    for (let item of filesInSourceFolder) {
      const filePath = path.join(sourceFolder, item);
      const fileStat = await stat(filePath);
  
      if (fileStat.isFile()) {
        const sourceFile = path.join(sourceFolder, item);
        const dectionationFile = path.join(dectinationFolder, item);
    
        await copyFile(sourceFile, dectionationFile);
      } else {
        await mkdir(path.join(dectinationFolder, item), {recursive: true}); 
        copy(filePath, path.join(dectinationFolder, item));
      }   
    }  
  } catch (err) {
    process.stdout.write(err.message);
  }  
}

async function copyDirectory(sourceAssetsFolder, dectinationAssetsFolder) {
  try {
    const isExist = await isFolderExist(dectinationAssetsFolder);
  
    if (isExist) {
      clearFolder(dectinationAssetsFolder);
    }
    
    await mkdir(dectinationAssetsFolder, {recursive: true});
    copy(sourceAssetsFolder, dectinationAssetsFolder);
  } catch (err) {
    process.stdout.write(err.message); 
  } 
}

async function writeFile(filePath, writableStream) {
  try {
    const content = await readFile(filePath);

    writableStream.write(content + '\n');
  } 
  catch (err) {
    process.stdout.write(err.message);
  }
}

async function mergeStyles(sourceFolder, bundlePath) {
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

async function buildHTML(dectinationFolder) {
  const sourceHTMLFolder = path.join(__dirname, 'components');  
  const sourceHtmlFile = path.join(__dirname, 'template.html');
  const destinationHTMLFile = path.join(dectinationFolder, 'index.html');  

  try {
    let HTMLtemplate = await readFile(sourceHtmlFile, 'utf-8');
    const HTMLFiles = await readdir(sourceHTMLFolder);

    for (let item of HTMLFiles) {      
      let fileHTMLPath = path.join(sourceHTMLFolder, item);
      let fileExtension = path.extname(fileHTMLPath);
      let fileName = path.basename(fileHTMLPath, fileExtension);
  
      let contentHTMLFile = await readFile(fileHTMLPath, { encoding: 'utf-8' });
      HTMLtemplate = HTMLtemplate.replace(`{{${fileName}}}`, contentHTMLFile);
    } 

    const writableStream = fs.createWriteStream(destinationHTMLFile);
    writableStream.write(HTMLtemplate);
  } catch (err) {
    process.stdout.write(err.message);
  }
}

async function clearFolder(folder) {
  try {
    const filesInFolder = await readdir(folder);
 
    for (let item of filesInFolder) {
      const filePath = path.join(folder, item);
      const fileStat = await stat(filePath);
  
      if (fileStat.isFile()) {
        const fileToDelete = path.join(folder, item);
        await unlink(fileToDelete);
      } else {
        clearFolder(filePath);
      }      
    }
  } catch (err) {
    process.stdout.write(err.message);
  } 
}

async function buildPage() {
  const dectinationFolder = path.join(__dirname, 'project-dist');

  const sourceStylesFolder = path.join(__dirname, 'styles');
  const dectinationCSSFile = path.join(dectinationFolder, 'style.css');

  const sourceAssetsFolder = path.join(__dirname, 'assets');
  const dectinationAssetsFolder = path.join(dectinationFolder, 'assets');

  try {
    await mkdir(dectinationFolder, {recursive: true}); 

    buildHTML(dectinationFolder);
    mergeStyles(sourceStylesFolder, dectinationCSSFile);
    copyDirectory(sourceAssetsFolder, dectinationAssetsFolder);
  } catch (err) {
    process.stdout.write(err.message);
  }  
}

buildPage();