export type Video = {
  id: string;
  title: string;
  episode?: string;
  description: string;
  youtubeId: string;
};

export const videos: Video[] = [
  {
    id: 'termites-ep1',
    title: 'Kid A',
    episode: 'EPISODE 1',
    description: 'Laura Jinn discovers something new while surfing the void.',
    youtubeId: 'u-QkMqxZWs0',
  },
  {
    id: 'termites-ep2',
    title: 'Get Lost!',
    episode: 'EPISODE 2',
    description: 'Tantrum enters the chat.',
    youtubeId: '3iTGqtmzLiI',
  },
];
