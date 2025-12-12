import AsyncStorage from "@react-native-async-storage/async-storage";

const THREE_MONHTHS_MS = 1000 * 60 * 60 * 24 * 30 * 3;

export const shouldShowReviewRequest = async () => {
  const lastRequested = await AsyncStorage.getItem("review_requested_at");

  if (!lastRequested) {
    return true;
  }

  const last = new Date(lastRequested).getTime();
  const now = Date.now();

  return now - last > THREE_MONHTHS_MS; // 7 days
};

export const markReviewRequersted = async () => {
  await AsyncStorage.setItem("review_requested_at", new Date().toISOString());
};

export const saveOpenApp = async () => {
  const openCount = await AsyncStorage.getItem("app_opened_at");
  const count = openCount ? parseInt(openCount, 10) : 0;
  if (count) {
    await AsyncStorage.setItem("app_opened_at", (count + 1).toString());
    return;
  }
  await AsyncStorage.setItem("app_opened_at", "1");
};

export const getOpenAppCount = async (): Promise<number> => {
  const openCount = await AsyncStorage.getItem("app_opened_at");
  const count = openCount ? parseInt(openCount, 10) : 0;
  return count;
};
