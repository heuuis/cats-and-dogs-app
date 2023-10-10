export interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface CategorisedImage {
  category: ContestantCategory;
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface ImagesById {
  [id: string]: Image;
}

export type TournamentState = "start" | "playing" | "end";
export type ContestantCategory = "cat" | "dog";
