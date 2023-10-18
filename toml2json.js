const fs = require('fs');
const toml = require('toml');

// Get the directory path from the command-line arguments
const directory = 'entries'; // process.argv[2];

// Read the contents of the specified directory
fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err.message);
    process.exit(1);
  }

  // Get file information for each file in the directory
  const fileInfos = files
    .filter(file => file.endsWith('.toml'))
    .map(file => {
      const filePath = `${directory}/${file}`;
      const stat = fs.statSync(filePath);
      return { file, stat };
    });

  // Process each file in the directory in alphabetical order
  fileInfos.sort((a, b) => a.file.localeCompare(b.file));
  const results = fileInfos.map(fileInfo => {
    const filePath = `${directory}/${fileInfo.file}`;
    const tomlContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = toml.parse(tomlContent);
    return jsonData;
  });

  console.log(JSON.stringify(results, null, 2));
});
