import { useNavigate } from 'react-router-dom';
import menuSrc from '../../assets/images/chat_world/chatworld-menu.png';
import { TERMITES_FILM_URL } from '../../data/links';

type Hotspot = {
  label: string;
  topPct: number;
  heightPct: number;
  onClick: () => void;
};

export const ChatWorldMenu = () => {
  const navigate = useNavigate();

  const hotspots: Hotspot[] = [
    {
      label: 'return to void',
      topPct: 15,
      heightPct: 22,
      onClick: () => navigate('/void'),
    },
    {
      label: 'explore',
      topPct: 37,
      heightPct: 21,
      onClick: () => navigate('/explore'),
    },
    {
      label: 'learn more',
      topPct: 58,
      heightPct: 27,
      onClick: () => window.open(TERMITES_FILM_URL, '_blank', 'noopener,noreferrer'),
    },
  ];

  return (
    <div
      className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
      style={{ width: 'min(196px, 20vw)' }}
    >
      <div className="relative pointer-events-auto" style={{ aspectRatio: '420 / 320' }}>
        <img
          src={menuSrc}
          alt="chat world menu"
          className="w-full h-full select-none"
          draggable={false}
        />
        {hotspots.map((h) => (
          <button
            key={h.label}
            aria-label={h.label}
            onClick={h.onClick}
            className="absolute left-[8%] right-0 cursor-pointer bg-transparent border-0 p-0"
            style={{ top: `${h.topPct}%`, height: `${h.heightPct}%` }}
          />
        ))}
      </div>
    </div>
  );
};
