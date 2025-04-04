export interface YoutubeWidget {
    id: number;
    tipo: 'video' | 'canal' | 'playlist';
    youtubeId: string;
    titulo: string;
  }
  