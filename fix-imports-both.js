const fs = require('fs');
const path = require('path');

// Get list of all TypeScript/JavaScript files
const getAllFiles = (dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) => {
  let results = [];

  try {
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recursively check subdirectories, skipping node_modules and .next
        if (file !== 'node_modules' && file !== '.next') {
          results = results.concat(getAllFiles(filePath, extensions));
        }
      } else {
        // Check if file has the right extension
        const ext = path.extname(filePath);
        if (extensions.includes(ext)) {
          results.push(filePath);
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return results;
};

// Main function to fix imports
const fixImports = (projectDir) => {
  console.log(`Starting import path fix in ${projectDir}...`);
  
  // Check if the directory exists
  const srcDir = path.join(projectDir, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`Directory not found: ${srcDir}`);
    return;
  }
  
  const files = getAllFiles(srcDir);
  let fixCount = 0;
  
  files.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace @/app/components/ imports with @/components/
      const originalContent = content;
      content = content.replace(/from\s+['"]@\/app\/components\//g, 'from \'@/components/');
      
      // Write the file only if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed imports in: ${filePath}`);
        fixCount++;
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error.message);
    }
  });
  
  console.log(`\nCompleted! Fixed ${fixCount} files in ${projectDir}.`);
};

// Run the script for both projects
fixImports('.');
fixImports('studylens-ai'); 