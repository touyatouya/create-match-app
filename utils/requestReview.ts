import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

const REVIEW_KEY = "hasReviewedApp";

export async function requestReview(): Promise<void> {
  try {
    const hasReviewed = await AsyncStorage.getItem(REVIEW_KEY);

    // すでにレビュー依頼済みなら何もしない
    if (hasReviewed === "true") {
      return;
    }

    const isAvailable = await StoreReview.isAvailableAsync();

    if (isAvailable) {
      await StoreReview.requestReview();
    }

    // ✅ 1度レビュー依頼したらフラグを保存
    await AsyncStorage.setItem(REVIEW_KEY, "true");
  } catch (error) {
    console.error("レビュー依頼エラー:", error);
  }
}
