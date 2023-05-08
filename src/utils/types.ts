export interface Album {
  image: string;
  name: string;
  artists: {
    name: string;
  }[];
  totalTracks: number;
  id: number;
}


