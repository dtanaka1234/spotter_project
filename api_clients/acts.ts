import { getHostUrlIfNode } from "./utils";
import { Act } from "../types/acts";

export interface ActsResponse {
  beatsheetTitle: string;
  acts: Act[];
}

export const getActs = async (beatsheetId: number): Promise<ActsResponse> => {
  const response = await fetch(`${getHostUrlIfNode()}/api/act-list?beatsheetId=${beatsheetId}`);
  return await response.json();
}