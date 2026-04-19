import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

const CHROMATIC_OFFSET = new Vector2(0.0006, 0.0006);

export const VoidPostFX = () => (
  <EffectComposer>
    <Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.2} mipmapBlur />
    <ChromaticAberration offset={CHROMATIC_OFFSET} radialModulation={false} modulationOffset={0} />
    <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
    <Vignette offset={0.3} darkness={0.8} />
  </EffectComposer>
);
