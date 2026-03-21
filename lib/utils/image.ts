/**
 * 브라우저 캔버스를 사용하여 이미지를 압축하고 리사이징합니다.
 * @param file 원본 파일 객체
 * @param maxWidth 최대 가로 너비 (기본 1200px)
 * @param quality 압축 품질 (0~1, 기본 0.8)
 * @returns 압축된 Blob 객체
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 리사이징 비율 계산
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context를 생성할 수 없습니다.'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('이미지 압축에 실패했습니다.'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = () => reject(new Error('이미지를 불러오는 중 오류가 발생했습니다.'));
        };
        reader.onerror = (error) => reject(error);
    });
}

/**
 * 파일 용량을 사람이 읽기 쉬운 단위로 변환합니다.
 */
export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
