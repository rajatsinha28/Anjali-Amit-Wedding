import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { copy } from "../../config/copy";
import { OpeningScreen } from "./OpeningScreen";

describe("OpeningScreen", () => {
  const renderOpening = () =>
    render(<OpeningScreen active={false} onHeroReveal={vi.fn()} onComplete={vi.fn()} />);

  it("renders the exact sacred copy and accessible opening control", () => {
    renderOpening();
    expect(screen.getByRole("heading", { name: copy.opening.heading })).toBeInTheDocument();
    for (const line of copy.opening.shloka.split("\n")) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    expect(screen.queryByText(/Vakratunda Mahakaya/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.opening.button })).toBeInTheDocument();
  });

  it("starts the transition once and disables repeat activation", () => {
    renderOpening();
    const button = screen.getByRole("button", { name: copy.opening.button });
    fireEvent.click(button, { clientX: 10, clientY: 10 });
    fireEvent.click(button, { clientX: 10, clientY: 10 });
    expect(button.querySelector("span")).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(screen.getByTestId("royal-doors")).toBeInTheDocument();
  });

  it("reveals the prepared hero once, then completes through the fallback", () => {
    vi.useFakeTimers();
    const onHeroReveal = vi.fn();
    const onComplete = vi.fn();
    render(<OpeningScreen active={false} onHeroReveal={onHeroReveal} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: copy.opening.button }));
    act(() => vi.advanceTimersByTime(1800));
    expect(onHeroReveal).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(950));
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("completes only once when the door animation finishes before the fallback", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<OpeningScreen active={false} onHeroReveal={vi.fn()} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: copy.opening.button }));
    const doors = screen.getByTestId("royal-doors");
    fireEvent.animationEnd(doors.children.item(1)!);
    act(() => vi.advanceTimersByTime(3000));
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
