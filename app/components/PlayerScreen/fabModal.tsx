import React, { useContext } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { Gender, Player, Rank } from "@/types";
import { generateUniqId } from "@/utils/createId";
// import analytics from "@react-native-firebase/analytics";

interface Props {
  isOpen: boolean;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingRef: React.RefObject<boolean>;
}

const FabModal: React.FC<Props> = ({
  isOpen,
  setMenuVisible,
  setAddModalVisible,
  isAddingRef,
}) => {
  const {
    players,
    setPlayers,
    anonymousPlayerCount,
    setAnonymousPlayerCount,
    courts,
    gameRounds,
    pairs,
  } = useContext(AppContext);

  const addAnonymousPlayer = async (): Promise<void> => {
    const existingIds = players.map((player) => player.id);
    const newId = generateUniqId(existingIds);

    const newPlayer: Player = {
      id: newId,
      name: (anonymousPlayerCount + 1).toString(),
      gender: Gender.未設定,
      matchCount: 0,
      isJoin: true,
      isRest: false,
      rank: Rank.未設定,
      isAnonymous: true,
      anonymousNumber: anonymousPlayerCount + 1,
    };

    setAnonymousPlayerCount((prev) => prev + 1);

    const newPlayers = [...players, newPlayer];
    setPlayers(newPlayers);
    setMenuVisible(false);
    isAddingRef.current = true;

    // await analytics().logEvent("add_player_anonymous", {
    //   anonymous_player_: players.filter((p) => p.isAnonymous).length,
    //   noAnonymous_player_: players.filter((p) => !p.isAnonymous).length,
    // });
  };

  const addNamedPlayer = async () => {
    setAddModalVisible(true);
    setMenuVisible(false);

    // await analytics().logEvent("open_add_player_modal_fab");
  };
  return (
    <Modal transparent visible={isOpen} animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setMenuVisible(false)}
      />

      {/* メニューカード */}
      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.menuItem} onPress={addAnonymousPlayer}>
          <Text style={styles.menuText}>番号でプレイヤー追加</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.menuItem} onPress={addNamedPlayer}>
          <Text style={styles.menuText}>名前でプレイヤー追加</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menuBox: {
    position: "absolute",
    bottom: 290,
    right: 30,
    backgroundColor: ColorPalette.whiteIcon,
    borderRadius: 16,
    paddingVertical: 8,
    width: 200,
    shadowColor: ColorPalette.blackText,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    padding: 14,
  },
  menuText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: ColorPalette.separator,
  },
});

export default FabModal;
