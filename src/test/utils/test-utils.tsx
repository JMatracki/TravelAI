import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AllTheProviders } from "../../providers/TestProviders";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export {
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook,
  cleanup,
} from "@testing-library/react";
export { customRender as render };
