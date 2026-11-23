import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AssetSpec } from "../../config/assets";
import { Img } from "./Img";

const asset: AssetSpec = {
  id: "test",
  width: 800,
  height: 1000,
  avif: [{ src: "/test.avif", width: 800 }],
  webp: [{ src: "/test.webp", width: 800 }],
  fallback: "/test.webp",
};

describe("Img", () => {
  it("uses a placeholder when no asset is available", () => {
    render(<Img asset={null} fallbackLabel="test.webp" alt="" />);
    expect(screen.getByTestId("placeholder-art")).toBeInTheDocument();
  });

  it("sets dimensions and falls back after an image error", () => {
    render(<Img asset={asset} fallbackLabel="test.webp" alt="Test artwork" />);
    const image = screen.getByRole("img", { name: "Test artwork" });
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "1000");
    fireEvent.error(image);
    expect(screen.getByTestId("placeholder-art")).toBeInTheDocument();
  });
});
