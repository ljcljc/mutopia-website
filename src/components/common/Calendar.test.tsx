import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Calendar } from "./Calendar";

describe("Calendar outside-month selection", () => {
  const lastDay = (day: string) => {
    const matches = screen.getAllByText(day);
    return matches[matches.length - 1];
  };

  it("selects an adjacent-month date only when enabled and within the date range", () => {
    const onDateChange = vi.fn();
    const props = {
      currentDate: new Date(2026, 9, 1),
      minDate: new Date(2026, 9, 31),
      maxDate: new Date(2026, 10, 8),
      onDateChange,
    };
    const { rerender } = render(<Calendar {...props} />);

    fireEvent.click(lastDay("1"));
    expect(onDateChange).not.toHaveBeenCalled();

    rerender(<Calendar {...props} allowOutsideMonthSelection />);
    fireEvent.click(lastDay("30"));
    expect(onDateChange).not.toHaveBeenCalled();

    fireEvent.click(lastDay("1"));
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 10, 1));

    fireEvent.click(lastDay("8"));
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 10, 8));
  });
});
