import { describe, expect, it } from "vitest";
import { getGroomerHealthDetailsAvatarUrl, hasCurrentHealthReport } from "./GroomerHealthDetailsPage";

describe("getGroomerHealthDetailsAvatarUrl", () => {
  it("prefers the booking pet_avatar over snapshot fallback fields", () => {
    expect(
      getGroomerHealthDetailsAvatarUrl(
        { pet_avatar: "/media/pets/anonymous/temp/photos/dog-3_M5LJX4r.jpg" },
        {
          avatar_url: "/media/pets/anonymous/temp/photos/dog-default.jpg",
          primary_photo: "/media/pets/anonymous/temp/photos/dog-primary.jpg",
        }
      )
    ).toContain("/media/pets/anonymous/temp/photos/dog-3_M5LJX4r.jpg");
  });

  it("falls back to snapshot fields when booking pet_avatar is missing", () => {
    expect(
      getGroomerHealthDetailsAvatarUrl(null, {
        primary_photo: "/media/pets/anonymous/temp/photos/dog-primary.jpg",
      })
    ).toContain("/media/pets/anonymous/temp/photos/dog-primary.jpg");
  });

  it("shows the health report card whenever the API returns a report object", () => {
    expect(
      hasCurrentHealthReport({
        report_id: 12,
        grade: "not_enough_data",
        insights: "Some report text",
      })
    ).toBe(true);
  });
});
