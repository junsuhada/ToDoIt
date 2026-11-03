import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';

export class PermissionDeniedError extends Error {}

export function candidateLines(result) {
  const lines = (result.blocks || []).flatMap((block) =>
    block.lines?.length ? block.lines.map((line) => line.text) : [block.text]
  );
  const content = lines.length ? lines : (result.text || '').split(/\r?\n/);
  return [...new Set(content.map((item) => item
    .replace(/^\s*(?:[-•*]|\d+[.)]|[□☐☑✓])\s*/, '')
    .replace(/\s+/g, ' ').trim())
    .filter((item) => item.length >= 2 && item.length <= 120))].slice(0, 40);
}

export async function recognizePhoto(source) {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) throw new PermissionDeniedError('카메라 접근이 거부되었습니다. 기기 설정에서 권한을 허용해 주세요.');
  }
  const result = source === 'camera'
    ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.9, base64: false, exif: false })
    : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9, base64: false, exif: false });
  if (result.canceled || !result.assets?.[0]?.uri) return null;
  const uri = result.assets[0].uri;
  const started = performance.now();
  try {
    // On-device Google ML Kit: no image upload and no cloud OCR API.
    const recognized = await TextRecognition.recognize(uri, TextRecognitionScript.KOREAN);
    return { candidates: candidateLines(recognized), elapsedMs: Math.round(performance.now() - started) };
  } finally {
    // Delete only our picker-created temporary cache file, never a library original.
    if (uri.startsWith(Paths.cache.uri)) {
      try { new File(uri).delete(); } catch (err) {
        console.warn('OCR 임시파일 정리 실패:', err?.message);
      }
    }
  }
}
