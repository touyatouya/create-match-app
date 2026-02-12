import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Pair, Player } from "@/types";
import PlayerItem from "@/ui/PlayerItem";
import PrimaryButton from "@/ui/PrimaryButton";
import RestPlayerItem from "@/ui/RestPlayerItem";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React, { useContext, useEffect } from "react";
import {
  Keyboard,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRest } from "../hooks/useRest";
import SectionFooter from "./sectionFooter";

type SectionDataItem = Pair | Player;

type Section = {
  title: string;
  type: "restPlayers" | "noRestPlayers";
  data: SectionDataItem[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RestModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { players } = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const { selectedPlayer, selectPlayer, createRestPlayer, removeRestPlayer } =
    useRest();

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "RestModal",
    });
  }, []);

  const restPlayers = players.filter((player) => player.isRest);
  const noRestPlayers = players.filter((player) => !player.isRest);

  const sections: Section[] = [
    {
      title: "休憩プレイヤー",
      data: restPlayers,
      type: "restPlayers",
    },
    {
      title: "プレイヤー",
      data: noRestPlayers,
      type: "noRestPlayers",
    },
  ];

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false}>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: 20,
          backgroundColor: ColorPalette.pageBackground,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
            style={styles.headerButton}
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.modalTitleWrapper}>
            <Text style={styles.title}>休憩</Text>
          </View>
        </View>
        <View style={styles.container}>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.id.toString() + index}
            renderItem={({ item, section }) =>
              section.type === "restPlayers" ? (
                <RestPlayerItem
                  item={item as Player}
                  onPressRemoveButton={() => removeRestPlayer(item.id)}
                />
              ) : (
                <PlayerItem
                  item={item as Player}
                  onPress={() => selectPlayer(item.id)}
                  isSelected={selectedPlayer.some((p) => item.id === p)}
                  selectedText="選択中"
                />
              )
            }
            renderSectionHeader={({ section }) =>
              section.type === "restPlayers" ? (
                <View style={styles.pairHeader}>
                  <View style={styles.restingTitle}>
                    <Feather
                      name="coffee"
                      size={20}
                      color={ColorPalette.blackText}
                    />
                    <Text style={styles.restingSectionTitle}>
                      {section.title}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.playerHeader}>
                  <View style={styles.restingTitle}>
                    <MaterialCommunityIcons
                      name="human-male"
                      size={24}
                      color={ColorPalette.normalIcon}
                    />
                    <Text style={styles.restingSectionTitle}>
                      {section.title}
                    </Text>
                  </View>
                </View>
              )
            }
            renderSectionFooter={({ section }) =>
              section.type === "restPlayers" ? (
                <SectionFooter
                  message="休憩プレイヤーはいません"
                  visible={section.data.length === 0}
                />
              ) : (
                <SectionFooter
                  message="参加中で休憩未設定のプレイヤーはいません"
                  visible={section.data.length === 0}
                />
              )
            }
          />
          <PrimaryButton onPress={createRestPlayer} text="休憩にする" />
        </View>
      </SafeAreaView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    ...globalStyles.touch,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
  },
  pairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  restingSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
  },
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
  },
});

export default RestModal;
