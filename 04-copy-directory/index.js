const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const copyDir = (folder, copyFolder) => {
  fs.mkdir(copyFolder, { recursive: true }, (err) => {
    if (err) {
      console.log('Error create folder:', err);
      return;
    }

    fs.readdir(folder, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log('Error read folder', err);
        return;
      }

      files.forEach((file) => {
        const mainFolderPath = path.join(folder, file.name);
        const copyFolderPath = path.join(copyFolder, file.name);

        fs.copyFile(mainFolderPath, copyFolderPath, (err) => {
          if (err) {
            console.log('Error copy file');
          } else {
            console.log(
              `file copied from ${mainFolderPath} to ${copyFolderPath}`,
            );
          }
        });
      });
    });
  });
};

copyDir(folderPath, copyFolderPath);
