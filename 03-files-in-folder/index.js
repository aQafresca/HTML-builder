const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log('Error reading directory', err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileName = path.parse(file.name).name;
      const fileExtension = path.parse(file.name).ext.slice(1);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log('Error retrieving file stats:', err);
          return;
        }
        const fileSize = stats.size;
        console.log(`${fileName}-${fileExtension}-${fileSize}`);
      });
    }
  });
});
