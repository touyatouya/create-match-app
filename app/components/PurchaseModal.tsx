import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import PrimaryButton from "./PrimaryButton";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose }) => {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length > 0
        ) {
          setOffering(offerings.current); // 最初のパッケージ
        }
      } catch (e) {
        console.warn("Offering取得失敗", e);
      }
    };
    fetchOfferings();
  }, []);

  const handlePurchase = async () => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(
        offering?.availablePackages[0] as PurchasesPackage
      );

      // ユーザーが課金済みか確認
      if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
        console.log("プレミアム購入済み！");
        // 自分のステートやストアに保存しておく
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error("購入エラー:", e);
      }
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalContainer}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                }}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>閉じる</Text>
              </TouchableOpacity>
              <View style={styles.modalTitleWrapper}>
                <Text style={styles.title}>pro版について</Text>
              </View>
            </View>

            <View style={styles.body}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: 8,
                  marginBottom: 32,
                }}
              >
                <MaterialCommunityIcons
                  name="star-four-points-outline"
                  size={20}
                  color={ColorPalette.normalIcon}
                />
                <Text
                  style={{ fontSize: FONT_SIZE.subsubheading, fontWeight: 600 }}
                >
                  pro版にアップグレードする
                </Text>
                <MaterialCommunityIcons
                  name="star-four-points-outline"
                  size={20}
                  color={ColorPalette.normalIcon}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 8,
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons name="check" size={24} color="black" />
                <Text style={{ fontSize: FONT_SIZE.body, fontWeight: 600 }}>
                  以下機能を、動画広告の視聴なしで使用可能に！
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 30,
                  rowGap: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: FONT_SIZE.body, fontWeight: 400 }}>
                  ・組み合わせ作成
                </Text>
                <Text style={{ fontSize: FONT_SIZE.body, fontWeight: 400 }}>
                  ・休憩プレイヤーの選択
                </Text>
                <Text style={{ fontSize: FONT_SIZE.body, fontWeight: 400 }}>
                  ・ペア作成
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 8,
                  marginBottom: 32,
                }}
              >
                <MaterialCommunityIcons name="check" size={24} color="black" />
                <Text style={{ fontSize: FONT_SIZE.body, fontWeight: 600 }}>
                  画面下のバナー広告が非表示になります
                </Text>
              </View>
              <PrimaryButton
                text="￥800円／無制限"
                icon={null}
                onPress={handlePurchase}
              />
              <Text style={{ fontSize: FONT_SIZE.small, marginTop: 8 }}>
                ※1度切りの購入でいつまでもpro版をお使い頂けます。
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalTitleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: ColorPalette.transparent,
  },
  modalContainer: {
    minHeight: Dimensions.get("window").height * 0.6,
    backgroundColor: ColorPalette.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    ...globalStyles.touch,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: {
    fontSize: FONT_SIZE.body,
    color: ColorPalette.link,
  },
  title: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default PurchaseModal;
