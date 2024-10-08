const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Ensure the dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Read the popup.js file
let popupJs = fs.readFileSync('popup.js', 'utf8');

// Replace placeholders with actual environment variables
popupJs = popupJs.replace('process.env.GOOGLE_API_KEY', `"${process.env.GOOGLE_API_KEY}"`);
popupJs = popupJs.replace('process.env.VIRUSTOTAL_API_KEY', `"${process.env.VIRUSTOTAL_API_KEY}"`);

// Write the modified content to a new file (or overwrite the existing one)
fs.writeFileSync(path.join(distDir, 'popup.js'), popupJs, 'utf8');

console.log('Build completed successfully.');