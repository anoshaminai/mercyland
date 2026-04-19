import kidA from '../assets/images/Kid A cover art.jpg';
import getLost from '../assets/images/Get Lost cover art.jpg';
import wtlgo from '../assets/images/wtlgo cover art.jpg';
import rt42 from '../assets/images/Rt42 cover art.jpg';

export type TermitesCover = {
  src: string | null;
  title: string;
};

export const termitesCovers: TermitesCover[] = [
  { src: kidA, title: 'Kid A' },
  { src: getLost, title: 'Get Lost!' },
  { src: wtlgo, title: 'When the Lights' },
  { src: rt42, title: 'Route 42' },
  { src: null, title: 'Single 5' },
];
