import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentThumbnailPlaceholder from "./ContentThumbnailPlaceholder";

describe("ContentThumbnailPlaceholder", () => {
  it("renders initials derived from the title", () => {
    render(<ContentThumbnailPlaceholder title="Introduction to Science" />);
    expect(screen.getByText("IS")).toBeInTheDocument();
  });

  it("applies a gradient as inline background style", () => {
    render(<ContentThumbnailPlaceholder title="Test Course" />);
    const el = screen.getByTestId("content-thumbnail-placeholder");
    expect(el.style.background).toContain("linear-gradient");
  });

  it("applies custom className", () => {
    render(
      <ContentThumbnailPlaceholder
        title="Test"
        className="w-full h-full rounded-xl"
      />
    );
    const el = screen.getByTestId("content-thumbnail-placeholder");
    expect(el).toHaveClass("w-full", "h-full", "rounded-xl");
  });

  it('renders "?" for empty title', () => {
    render(<ContentThumbnailPlaceholder title="" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("is aria-hidden", () => {
    render(<ContentThumbnailPlaceholder title="Test" />);
    expect(
      screen.getByTestId("content-thumbnail-placeholder")
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("skips stop words in initials", () => {
    render(
      <ContentThumbnailPlaceholder title="The Art of Programming" />
    );
    expect(screen.getByText("AP")).toBeInTheDocument();
  });
});
