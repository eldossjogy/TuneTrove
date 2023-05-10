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

export interface Profile{
  id: string;
  updated_at: string
  username: string
  fullname: string | null;
  avatar: string | null;
  privacy: string | null;
  color_scheme: string | null;
}
