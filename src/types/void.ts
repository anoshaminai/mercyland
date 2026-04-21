export type VoidContent =
  | { type: 'image'; src: string; alt: string }
  | { type: 'music'; albumArt: string; embedUrl: string; title: string }
  | { type: 'video'; youtubeId: string; title: string }
  | { type: 'text'; body: string; title?: string }
  | { type: 'link'; label: string; url: string };

export interface VoidObject {
  id: string;
  content: VoidContent;
  clickable?: boolean;
  planeSrc?: string;
}
