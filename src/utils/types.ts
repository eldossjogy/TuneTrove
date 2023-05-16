export interface Album {
  name: string;
  image: string;
  label: string;
  spotifyPopularity: number;
  totalTracks: number;
  releaseDate: number;
  genres: string[];
  artists: {
    id: number;
    name: string;
  }[];
  externalIds: {
    upc: string;
    spotify: string[];
  };
  type: string;
  id: number;
}

export interface Artist {
  externalIds: {
    spotify: string[];
  };
  followers: number;
  genres: string[];
  id: number;
  image: string;
  name: string;
  spotifyPopularity: number;
}

export interface Rating {
  created_at?: string;
  updated_at?: string;
  rating?: number;
  album_id?: number;
  user_id?: string;
}

export interface Profile {
  id: string;
  updated_at: string;
  username: string;
  fullname: string | null;
  avatar: string | null;
  privacy: string | null;
  color_scheme: string | null;
}

export interface Track {
  albums: {
    image: string;
    name: string;
    id: number;
  }[];
  artists: {
    name: string;
    id: number;
  }[];
  durationMs: number;
  explicit: boolean;
  externalIds: {
    isrc: string;
    spotify: string[];
  };
  id: number;
  name: string;
  spotifyPopularity: number;
  spotifyPreview: string;
}

export interface AlbumRating {
  id: number;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  user_id?: string;
  album_id?: number;
  rating?: number;
  image: string;
  name: string;
  artist: {
    id: number;
    name: string;
  }[];
}
