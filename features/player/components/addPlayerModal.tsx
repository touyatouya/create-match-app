import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput as TextInputOrigin,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { Gender } from "@/types";
import GenderToggle from "@/ui/GenderToggle";
import TextInput from "@/ui/TextInput";
import { savePlayerInfo } from "@/utils/saveStorage";
import analytics from "@react-native-firebase/analytics";
import { useAddPlayer } from "../hooks/useAddPlayer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isAddingRef: React.RefObject<boolean>;
}

const AddPlayerModal: React.FC<Props> = ({ isOpen, onClose, isAddingRef }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.未設定);
  const { addPlayer: setNewPlayer } = useAddPlayer();

  const textInputRef = useRef<TextInputOrigin>(null);

  const addPlayer = async (): Promise<void> => {
    if (name.trim() === "") return;
    const newPlayers = setNewPlayer(false, name);
    isAddingRef.current = true;

    savePlayerInfo(
      newPlayers
        .filter((p) => !p.isAnonymous)
        .map((player) => {
          return {
            id: player.id,
            name: player.name,
            gender: player.gender,
            rank: player.rank,
          };
        }),
    );
    onClose();

    await analytics().logEvent("add_player_name");
  };

  const resetInput = () => {
    setName("");
    setGender(Gender.未設定);
  };

  useEffect(() => {
    if (isOpen) {
      // addPlayer関数内で発火すると、リセットされない事象が発生したため、モーダルを開閉タイミングでリセットする。
      resetInput();
    }
  }, [isOpen]);

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        {/* 背景部分のみをタップ可能にして閉じる */}
        <TouchableWithoutFeedback
          onPress={() => {
            resetInput();
            onClose();
          }}
        >
          <View style={styles.backgroundTouchable} />
        </TouchableWithoutFeedback>

        {/* モーダル本体（タップを妨げない） */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                resetInput();
                onClose();
              }}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>キャンセル</Text>
            </TouchableOpacity>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.title}>新規プレイヤー追加</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                addPlayer();
              }}
              style={styles.headerButton}
            >
              <Text
                style={[
                  styles.headerButtonText,
                  name.trim() === "" && { color: ColorPalette.muted },
                ]}
              >
                作成
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text>名前</Text>
            <TextInput
              ref={textInputRef}
              placeholder="名前を入力"
              value={name}
              onChangeText={setName}
              autoFocus
              onSubmitEditing={() => Keyboard.dismiss()}
              clearInput={() => setName("")}
            />
            <Text>性別</Text>
            <GenderToggle value={gender} setGender={setGender} />
          </View>
        </KeyboardAvoidingView>
      </View>
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
    minHeight: Dimensions.get("window").height * 0.8,
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
  backgroundTouchable: {
    flex: 1,
  },
});

export default AddPlayerModal;
