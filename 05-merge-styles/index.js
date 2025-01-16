const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const projectFolderPath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(projectFolderPath, '', (err) => {
  if (err) {
    console.log('Error create file', err);
    return;
  }

  fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log('Error read directory', err);
      return;
    }

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesFolderPath, file.name);

        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) {
            console.log(`Error read ${file.name}`, err);
            return;
          }

          fs.appendFile(projectFolderPath, data + '\n', (err) => {
            if (err) {
              console.log(`Error merge ${file.name}`, err);
            } else {
              console.log(`${file.name} merged to bundle.css`);
            }
          });
        });
      }
    });
  });
});
