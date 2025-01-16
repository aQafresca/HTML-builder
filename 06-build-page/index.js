const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'project-dist');
const assetsFolderPath = path.join(__dirname, 'assets');
const copyAssetsFolderPath = path.join(__dirname, 'project-dist', 'assets');
const stylePath = path.join(__dirname, 'styles');
const mainStylePath = path.join(__dirname, 'project-dist', 'style.css');
const mainHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
const templateFilePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');

fs.mkdir(folderPath, { recursive: true }, (err) => {
  if (err) {
    console.log('Error create folder', err);
    return;
  }
});

fs.writeFile(mainStylePath, '', (err) => {
  if (err) {
    console.log('Error write file style.css');
    return;
  }

  fs.readdir(stylePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log('Error read directory', err);
      return;
    }

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const styleFilePath = path.join(stylePath, file.name);

        fs.readFile(styleFilePath, 'utf-8', (err, data) => {
          if (err) {
            console.log(`Error read ${file.name}`, err);
          }

          fs.appendFile(mainStylePath, data + '\n', (err) => {
            if (err) {
              console.log(`Error merge ${file.name}`, err);
            } else {
              console.log(`${file.name} merged to style.css`);
            }
          });
        });
      }
    });
  });
});

const createHtml = () => {
  fs.readFile(templateFilePath, 'utf-8', (err, templateContent) => {
    if (err) {
      console.log('Error reading template file:', err);
      return;
    }

    fs.readdir(componentsFolderPath, (err, files) => {
      if (err) {
        console.log('Error reading directory:', err);
        return;
      }

      let components = {};
      let filesProcessed = 0;
      if (files.length === 0) {
        writeMainHtml(templateContent);
      }

      files.forEach((file) => {
        const componentPath = path.join(componentsFolderPath, file);
        const componentName = path.basename(file, path.extname(file));

        fs.readFile(componentPath, 'utf-8', (err, componentContent) => {
          if (err) {
            console.log(`Error reading ${file}:`, err);
            return;
          }
          components[`{{${componentName}}}`] = componentContent;
          filesProcessed += 1;
          if (filesProcessed === files.length) {
            writeMainHtml(replace(templateContent, components));
          }
        });
      });
    });
  });
};

const replace = (template, components) => {
  let result = template;
  for (const [key, value] of Object.entries(components)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }
  return result;
};

const writeMainHtml = (content) => {
  fs.writeFile(mainHtmlPath, content, (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log('Create HTML file successful, path:', mainHtmlPath);
    }
  });
};

const copyDir = (assetsFolderPath, copyAssetsFolderPath) => {
  fs.mkdir(copyAssetsFolderPath, { recursive: true }, (err) => {
    if (err) {
      console.log('Error create assets folder', err);
      return;
    }

    fs.readdir(assetsFolderPath, (err, entries) => {
      if (err) {
        console.log('Error read file type', err);
        return;
      }

      entries.forEach((entry) => {
        const assetsPath = path.join(assetsFolderPath, entry);
        const copyAssetsPath = path.join(copyAssetsFolderPath, entry);

        fs.stat(assetsPath, (err, stats) => {
          if (err) {
            console.log(
              `error when retrieving file information ${assetsPath}`,
              err,
            );
            return;
          }

          if (stats.isDirectory()) {
            copyDir(assetsPath, copyAssetsPath);
          } else {
            fs.copyFile(assetsPath, copyAssetsPath, (err) => {
              if (err) {
                console.log(`Error copy ${entry}`);
              } else {
                console.log(`${entry} copied to assets`);
              }
            });
          }
        });
      });
    });
  });
};

createHtml();
copyDir(assetsFolderPath, copyAssetsFolderPath);
