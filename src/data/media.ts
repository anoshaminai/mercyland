export type Song = {
  id: string;
  title: string;
  albumArt?: string;
  spotifyEmbed?: string;
  soundcloudEmbed?: string;
  bandcampEmbed?: string;
  appleMusicEmbed?: string;
};

export const songs: Song[] = [
  {
    id: 'kid-a',
    title: 'Kid A',
    albumArt: new URL('../assets/images/Kid A cover art.jpg', import.meta.url).href,
    spotifyEmbed:
      'https://open.spotify.com/embed/album/2VHtTgQDgzi3z4MewLHfSP?utm_source=generator',
    soundcloudEmbed:
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2080693716&color=%23902722&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
    bandcampEmbed:
      'https://bandcamp.com/EmbeddedPlayer/track=1301656413/size=large/bgcol=333333/linkcol=0f91ff/minimal=true/transparent=true/',
  },
];
