import { Types } from "mongoose";

export interface ITour {
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  location?: string;
  constFrom?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string;
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
}
