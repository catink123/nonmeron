export class ImageResizer {
    static reduceSize(imageURL: string, maxWidth: number, maxHeight: number, mimeType: string): Promise<string> {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            const inputImage = new Image();
            inputImage.onload = () => {
                let w, h;
                if (inputImage.width > inputImage.height) {
                    w = maxWidth;
                    h = inputImage.height / inputImage.width * maxWidth;
                } else {
                    w = inputImage.width / inputImage.height * maxHeight;
                    h = maxHeight;
                }
                canvas.width = w;
                canvas.height = h;
                ctx!.drawImage(inputImage, 0, 0, w, h);
                resolve(canvas.toDataURL(mimeType));
            };
            inputImage.src = imageURL;
        });
    }
}