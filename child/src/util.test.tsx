import { add } from "./util";
import "@testing-library/jest-dom";
import { h } from "preact";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import Accordion from "./accordion";
test("add", () => {
  expect(add()).toBe(0);
  expect(add(1)).toBe(1);
  expect(add(1, 2, 3)).toBe(6);
});

describe("Accordion", () => {
  beforeEach(() => {
    render(
      <Accordion title="Testing">
        <h4>Content</h4>
      </Accordion>
    );
  });

  test("should show title all the time", () => {
    expect(screen.getByText(/Testing/i)).toBeInTheDocument();
  });

  test("should not show the content at the start", () => {
    expect(screen.queryByText(/Content/i)).not.toBeInTheDocument();
  });

  test("should show the content on accordion click", async () => {
    const title = screen.getByText(/Show/i);
    fireEvent.click(title);

    expect(await screen.findByText(/Content/i)).toBeInTheDocument();
  });
});
/*
https://www.eternaldev.com/blog/testing-a-react-application-with-vitest/ 
https://github.com/vitest-dev/vitest/blob/main/examples/react-storybook/src/App.test.tsx
https://preactjs.com/guide/v10/preact-testing-library/ 
https://storybook.js.org/docs/preact/get-started/introduction 

*/
