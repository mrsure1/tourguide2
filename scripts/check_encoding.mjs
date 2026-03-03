import fs from 'fs';
import path from 'path';

// 리스트할 확장자들
const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.md', '.sql', '.py'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'tmp'];

function isUtf8(buffer) {
    // 간단한 UTF-8 검사 로직 (BOM 또는 패턴 확인)
    // 여기서는 완벽한 chardet보다는 대략적인 패턴과 오류 체크를 사용합니다.
    try {
        const decoder = new TextDecoder('utf-8', { fatal: true });
        decoder.decode(buffer);
        return true;
    } catch (e) {
        return false;
    }
}

function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                checkDirectory(fullPath);
            }
        } else if (TARGET_EXTENSIONS.includes(path.extname(file))) {
            const buffer = fs.readFileSync(fullPath);
            if (!isUtf8(buffer)) {
                console.log(`NON-UTF8: ${fullPath}`);
            }
        }
    }
}

console.log("Checking file encodings...");
checkDirectory('.');
console.log("Check complete.");
