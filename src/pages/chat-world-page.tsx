import { useState, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { SceneControls } from '../components/shared/scene-controls';
import { ScatteredObjects } from '../components/shared/scattered-objects';
import { VoidPostFX } from '../components/shared/void-post-fx';
import { chatMessages } from '../data/chat-messages';
import { VoidNav } from '../components/VoidNav';
import { ChatWorldMenu } from '../components/chat-world/chat-world-menu';
import { ObjectDetail } from '../components/void/object-detail';
import { LoadingOverlay } from '../components/void/loading-overlay';
import { useChatWorldAccess } from '../hooks/useChatWorldAccess';
import chatWorldBgUrl from '../assets/video/ChatWorld-Background.mp4?url';
import cardboardBoxUrl from '../assets/models/cardboardBox.glb?url';
import type { VoidObject } from '../types/void';

const CHAT_WORLD_MODELS = [cardboardBoxUrl];

export const ChatWorldPage = () => {
  const [hasAccess] = useChatWorldAccess();
  const [selected, setSelected] = useState<VoidObject | null>(null);

  const messagesById = useMemo(
    () => new Map(chatMessages.map((m) => [m.id, m])),
    [],
  );

  const handleObjectClick = useCallback(
    (id: string) => {
      const msg = messagesById.get(id);
      if (!msg) return;
      setSelected(msg);
    },
    [messagesById],
  );

  if (!hasAccess) return <Navigate to="/gate" replace />;

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: '#2a0a1e' }}>
      <VoidNav />
      <ChatWorldMenu />
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <SceneControls autoRotate={!selected} backgroundSrc={chatWorldBgUrl} />
        <ScatteredObjects
          items={chatMessages}
          models={CHAT_WORLD_MODELS}
          radius={[3, 9]}
          seed={77}
          onObjectClick={handleObjectClick}
        />
        <VoidPostFX />
      </Canvas>
      <LoadingOverlay />
      <AnimatePresence>
        {selected && (
          <ObjectDetail content={selected.content} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
