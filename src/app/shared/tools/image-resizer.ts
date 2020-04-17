export class ImageResizer {

  /**
   * Resize an image and return the corresponding dataUrl
   */
  public static resizeImage(img: HTMLImageElement, maxWidth: number, maxHeight: number): string {
    const canvas = document.createElement('canvas');
    const ctxForNonResizedImage = canvas.getContext('2d');
    ctxForNonResizedImage.drawImage(img, 0, 0);

    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }
    canvas.width = width;
    canvas.height = height;

    const ctxForResizedImage = canvas.getContext('2d');
    ctxForResizedImage.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');

    img.remove();
    canvas.remove();

    return dataUrl;
  }
}
