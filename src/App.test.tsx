import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Update this import path

// Add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";

describe("App", () => {
  test("renders NavBar component", () => {
    render(<App />, { wrapper: BrowserRouter });
    const navElement = screen.getByRole("navigation"); // assuming your NavBar has a semantic <nav> element
    expect(navElement).toBeInTheDocument();
  });
});
