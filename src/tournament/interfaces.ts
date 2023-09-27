export interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface Contestants {
  [id: string]: Image;
}

export type TournamentState = "start" | "playing" | "end";
export type ContestantCategory = "cat" | "dog";