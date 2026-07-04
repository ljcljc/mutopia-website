import { describe, expect, it } from "vitest";
import {
  formatCanadianPostalCodeInput,
  getCanadianPostalCodeError,
  isValidCanadianPostalCode,
  normalizeCanadianPostalCode,
} from "./postalCode";

describe("postalCode", () => {
  it("accepts valid Canadian postal codes", () => {
    expect(isValidCanadianPostalCode("V6B 1A1")).toBe(true);
    expect(isValidCanadianPostalCode("v6b1a1")).toBe(true);
  });

  it("rejects invalid Canadian postal codes", () => {
    expect(isValidCanadianPostalCode("12345")).toBe(false);
    expect(isValidCanadianPostalCode("ABCDE")).toBe(false);
  });

  it("normalizes Canadian postal codes to uppercase with a space", () => {
    expect(normalizeCanadianPostalCode("v6b1a1")).toBe("V6B 1A1");
  });

  it("formats postal code input progressively", () => {
    expect(formatCanadianPostalCodeInput("v")).toBe("V");
    expect(formatCanadianPostalCodeInput("v6b")).toBe("V6B");
    expect(formatCanadianPostalCodeInput("v6b1")).toBe("V6B 1");
    expect(formatCanadianPostalCodeInput("v6b-1a1")).toBe("V6B 1A1");
  });

  it("returns the expected validation error", () => {
    expect(getCanadianPostalCodeError("")).toBe("Postal code is required");
    expect(getCanadianPostalCodeError("12345")).toBe("Enter a valid postal code");
    expect(getCanadianPostalCodeError("V6B 1A1")).toBe("");
  });
});
