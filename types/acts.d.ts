import { Beat } from "./beats";

export interface Act {
  id: number;
  description: string;
  beats: Beat[];
}