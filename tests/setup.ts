import { vi } from "vitest";

vi.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

vi.mock("@react-native-firebase/analytics", () => ({
  default: () => ({
    logEvent: vi.fn(),
  }),
}));

vi.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      version: "test",
    },
  },
}));

vi.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

vi.setConfig({
  testTimeout: 60_0000,
});
