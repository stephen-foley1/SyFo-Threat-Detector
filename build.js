const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

let popupJs = fs.readFileSync('popup.js', 'utf8');
popupJs = popupJs.replace('process.env.GOOGLE_API_KEY', `"${process.env.GOOGLE_API_KEY}"`);
popupJs = popupJs.replace('process.env.VIRUSTOTAL_API_KEY', `"${process.env.VIRUSTOTAL_API_KEY}"`);

fs.writeFileSync(path.join(distDir, 'popup.js'), popupJs, 'utf8');

console.log('Build completed successfully.');