const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const copyDir = (folder, copyFolder) => {
  fs.rm(copyFolder, { recursive: true, force: true }, (err) => {
    if (err) {
      console.log('Error removing folder:', err);
      return;
    }

    fs.mkdir(copyFolder, { recursive: true }, (err) => {
      if (err) {
        console.log('Error creating folder:', err);
        return;
      }

      fs.readdir(folder, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.log('Error reading folder:', err);
          return;
        }

        files.forEach((file) => {
          const mainFilePath = path.join(folder, file.name);
          const copyFilePath = path.join(copyFolder, file.name);

          if (file.isDirectory()) {
            copyDir(mainFilePath, copyFilePath);
          } else {
            fs.copyFile(mainFilePath, copyFilePath, (err) => {
              if (err) {
                console.log(`Error copy file:`, err);
              } else {
                console.log(
                  `File copied from ${mainFilePath} to ${copyFilePath}`,
                );
              }
            });
          }
        });
      });
    });
  });
};

copyDir(folderPath, copyFolderPath);
