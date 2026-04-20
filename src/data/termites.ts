import kidA from '../assets/images/cover art/Kid A cover art.jpg';
import getLost from '../assets/images/cover art/Get Lost cover art.jpg';
import wtlgo from '../assets/images/cover art/wtlgo cover art.jpg';
import rt42 from '../assets/images/cover art/Rt42 cover art.jpg';
import termites from '../assets/images/cover art/Termites cover art.jpg';

export type TermitesCover = {
  src: string;
  title: string;
};

export const termitesCovers = {
  termites: { src: termites, title: 'Termites' },
  kidA: { src: kidA, title: 'Kid A' },
  rt42: { src: rt42, title: 'Route 42' },
  getLost: { src: getLost, title: 'Get Lost!' },
  wtlgo: { src: wtlgo, title: 'When the Lights' },
} satisfies Record<string, TermitesCover>;
