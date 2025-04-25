// types/index.ts
export interface MusicItem {
    id: string;
    title: string;
    releaseDate: string;
    coverArt: string;
    streamingLinks: {
      spotify?: string;
      appleMusic?: string;
      youtube?: string;
      soundcloud?: string;
    };
  }
  
  export interface VideoItem {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnailUrl: string;
  }
