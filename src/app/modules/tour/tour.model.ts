import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
import { Division } from "../division/division.model";

const tourTypeSchema = new Schema<ITourType>(
  { name: { type: String, required: true, unique: true } },
  { timestamps: true },
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String },
    location: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    constFrom: { type: Number },
    minAge: { type: Number },
    maxGuest: { type: Number },
    images: { type: [String], default: [] },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    division: { type: Schema.Types.ObjectId, ref: Division, required: true },
    tourType: { type: Schema.Types.ObjectId, ref: TourType, required: true },
  },
  { timestamps: true },
);

tourSchema.pre("save", async function () {
  if (this.isModified("title")) {
    const baseSlug = this.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
});

tourSchema.pre("findOneAndUpdate", async function () {
  const tour = this.getUpdate() as Partial<ITour>;

  if (tour.title) {
    const baseSlug = tour.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    tour.slug = slug;
  }
  this.setUpdate(tour);
});

export const Tour = model<ITour>("Tour", tourSchema);
