export interface Album {
  image: string;
  name: string;
  artists: {
    name: string;
  }[];
  totalTracks: number;
  id: number;
}

export interface Artist {
  name: string;
  image: string;
  id: number;
}

export interface Rating {
  created_at?: string;
  updated_at?: string;
  rating?: number;
}
