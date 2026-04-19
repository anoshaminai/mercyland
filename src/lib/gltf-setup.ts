import { useGLTF } from '@react-three/drei';
import { MODEL_URLS } from '../components/shared/model-manifest';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
MODEL_URLS.forEach((url) => useGLTF.preload(url));
