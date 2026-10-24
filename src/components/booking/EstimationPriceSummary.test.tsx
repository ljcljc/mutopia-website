import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EstimationPriceSummary } from "./EstimationPriceSummary";

describe("EstimationPriceSummary", () => {
  it("shows only applied offers and composes the payment from service, membership, and tax", () => {
    render(<EstimationPriceSummary
      original={133}
      service={104.7}
      membership={99}
      tax={10.19}
      payable={213.89}
      offers={["10% OFF", "-$5.00 Cash credit"]}
      paymentLabel="Pay in next step"
      membershipVerb="will be"
      toggle={<button type="button">Details</button>}
    />);

    expect(screen.getByText("was $133.00")).toBeInTheDocument();
    expect(screen.getByLabelText("Applied offers")).toHaveTextContent("10% OFF");
    expect(screen.getByText("* $99.00 Membership fee will be added.")).toBeInTheDocument();
    expect(screen.getByText("Pay in next step: $104.70 + $99.00 + $10.19 tax = $213.89")).toBeInTheDocument();
  });
});
