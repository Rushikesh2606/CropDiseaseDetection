import api from './api';

const MAX_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTS  = ['.jpg', '.jpeg', '.png', '.webp'];

export function validateFile(file, maxMb = MAX_MB) {
  if (!file) return 'No file selected.';
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
    return `File type not supported. Please upload a JPG, PNG, or WEBP image.`;
  }
  if (file.size === 0) return 'File is empty.';
  if (file.size > maxMb * 1024 * 1024) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${maxMb} MB.`;
  }
  return null; // valid
}

export async function predictLeaf(file, signal) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/predict', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal,
  });
  return data;
}
