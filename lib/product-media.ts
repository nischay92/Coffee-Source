export const productUploadPrefix = '/images/uploads/';
export const maxProductPhotos = 6;
export const maxProductPhotoBytes = 2 * 1024 * 1024;
export const maxProductUploadBytes = 4 * 1024 * 1024;
export const uuidPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export function productUploadPath(id: string) {
  return `${productUploadPrefix}${id}/`;
}

export function isProductUpload(path: string) {
  return path.startsWith(productUploadPrefix);
}
