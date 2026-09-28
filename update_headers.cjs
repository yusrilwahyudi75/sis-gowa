const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'admin.html');

for (const file of files) {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // More robust regex
    const regex = /<div class="bg-primary text-white py-5 text-center position-relative overflow-hidden">[\s\S]*?<h1 class="display-5 fw-bold mb-3">(.*?)<\/h1>\s*<p class="lead opacity-75 mb-0">(.*?)<\/p>[\s\S]*?<\/div>(\s*<div class="position-absolute.*?<\/div>)*\s*<\/div>/g;

    const match = regex.exec(content);
    if (match) {
        const title = match[1];
        const subtitle = match[2];
        const newHeader = `<page-header title="${title}" subtitle="${subtitle}"></page-header>`;
        content = content.replace(regex, newHeader);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        // already updated?
        if (content.includes('<page-header')) {
            console.log(`Already updated ${file}`);
        } else {
            console.log(`No match in ${file}`);
        }
    }
}
