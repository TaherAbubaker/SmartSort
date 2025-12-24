/*
instructions
1- copy and paste in ur IDE of choice
2- make sure u have nodejs installed
3- create a folder named "organize" (or any name u want) in the same directory as this file
4- add files to the folder u created (imges and videos and documents and music and zip files)
5- run the code
6- check the folder u created
7- u will see that the files are organized in different folders
8- congratulation u have successfully organized your files
9- next is fs.watch and GUI but im lazy to do it rn..... :)
*/

const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "organize");
const logFilePath = path.join(__dirname, "log.txt");

const types = {
    Images: [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".bmp", ".tiff", ".psd", ".raw", ".heic", ".heif", ".avif"],
    Videos: [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".flv", ".webm", ".mpg", ".mpeg", ".m4v", ".3gp", ".3g2", ".asf", ".asx"],
    Documents: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".rtf", ".odt", ".ods", ".odp"],
    Music: [".mp3", ".wav", ".flac", ".aac", ".wma", ".m4a", ".ogg", ".opus"],
    Archives: [".zip", ".rar", ".7z", ".tar", ".gz"],
    Installers: [".exe", ".msi", ".dmg", ".pkg", ".deb", ".rpm"],
    Code: [".js", ".html", ".css", ".py", ".java", ".cpp", ".c", ".cs", ".php", ".rb", ".go", ".rs", ".ts", ".json", ".xml", ".yaml", ".yml", ".md", ".sh", ".bat", ".ps1"]
};

// Ensure basic folders exist on start
ensureCategoryFolders(folderPath);

console.log(`👀 Watching for files in: ${folderPath}`);
console.log("Press Ctrl+C to stop.");

// 1. WATCHER
let processing = false;
fs.watch(folderPath, (eventType, filename) => {
    if (!filename || processing) return;

    // Debounce/Throttling to avoid double events
    processing = true;
    setTimeout(() => processing = false, 100);

    const fullpath = path.join(folderPath, filename);

    // Wait slightly for file to be fully written/released
    setTimeout(() => {
        try {
            // Check if file still exists and is not a directory
            if (fs.existsSync(fullpath) && fs.statSync(fullpath).isFile()) {
                organizeFile(filename, fullpath);
            }
        } catch (err) {
            // Ignore errors (e.g. file moved/deleted quickly)
        }
    }, 500);
});

function organizeFile(filename, fullpath) {
    const stats = fs.statSync(fullpath);
    const ext = path.extname(filename).toLowerCase();
    let category = "Others";

    // 2. RULES ENGINE

    // Rule: Large Files (> 100MB)
    const fileSizeMB = stats.size / (1024 * 1024);
    if (fileSizeMB >= 100) {
        category = "Large Files";
    } else {
        // Standard extension matching
        for (let key in types) {
            if (types[key].includes(ext)) {
                category = key;
                break;
            }
        }
    }

    moveFile(fullpath, folderPath, category);
}

function moveFile(fullpath, folderPath, category) {
    const destFolder = path.join(folderPath, category);

    // Ensure specific category folder exists (e.g. "Large Files")
    if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder);
    }

    const parsed = path.parse(fullpath);
    let dest = path.join(destFolder, parsed.base);
    let counter = 1;

    // Avoid overwrites
    while (fs.existsSync(dest)) {
        const newName = `${parsed.name}(${counter})${parsed.ext}`;
        dest = path.join(destFolder, newName);
        counter++;
    }

    try {
        fs.renameSync(fullpath, dest);
        const msg = `Moved: ${parsed.base} -> ${category}`;
        console.log(msg);
        logAction(msg);
    } catch (err) {
        console.error(`❌ Error moving ${parsed.base}:`, err.message);
    }
}

function ensureCategoryFolders(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    for (let category in types) {
        const folder = path.join(folderPath, category);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }
}

// 3. LOGGING
function logAction(message) {
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry);
}

