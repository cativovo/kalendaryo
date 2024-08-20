import { afterEach, vi } from "vitest";

afterEach(() => {
  // add cleanup here
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});
