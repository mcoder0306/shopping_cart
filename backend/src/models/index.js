import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registerModels = async () => {
    const files = fs.readdirSync(__dirname);

    for (const file of files) {
        if (file.endsWith('.js') && file !== 'index.js') {
            const filePath = path.join(__dirname, file);
            // Convert to file URL for ESM import on Windows/Linux compatibility
            const fileUrl = pathToFileURL(filePath).href;
            await import(fileUrl);
        }
    }
    console.log("All models registered dynamically");
};

export { registerModels };
