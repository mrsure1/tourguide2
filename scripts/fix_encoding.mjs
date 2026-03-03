import fs from 'fs';
import path from 'path';

// 리스트할 확장자들
const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.md', '.sql', '.py', '.txt', '.json'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'tmp', 'dist', 'build'];

function fixFile(fullPath) {
    try {
        const buffer = fs.readFileSync(fullPath);

        // 이미 UTF-8인 경우 건너뜁니다.
        // TextDecoder는 잘못된 시퀀스에 대해 fatal: true 옵션을 사용하면 에러를 던집니다.
        try {
            new TextDecoder('utf-8', { fatal: true }).decode(buffer);
            // UTF-8로 디코딩 성공 -> 변환 필요 없음
            return;
        } catch (e) {
            // UTF-8이 아님 -> CP949로 시도해봅니다.
            console.log(`Converting to UTF-8: ${fullPath}`);
            // Windows의 한글 인코딩은 대개 CP949(EUC-KR의 확장)입니다.
            // Node.js 기본 TextDecoder는 'cp949'를 지원하지 않을 수 있으므로 
            // 명시적으로 'euc-kr'을 시도하거나 에러 발생 시 수동 조치가 필요할 수 있습니다.
            const decoder = new TextDecoder('euc-kr');
            const content = decoder.decode(buffer);
            fs.writeFileSync(fullPath, content, 'utf-8');
        }
    } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                walk(fullPath);
            }
        } else if (TARGET_EXTENSIONS.includes(path.extname(file))) {
            fixFile(fullPath);
        }
    }
}

console.log("Starting encoding conversion to UTF-8...");
walk('.');
console.log("Conversion complete.");
