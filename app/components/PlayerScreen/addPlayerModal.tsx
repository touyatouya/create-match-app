import React, { useContext, useRef, useState } from "react";
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

import Colors from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Gender, Player, Rank } from "@/types";
import { generateUniqId } from "@/utils/createId";
import { savePlayerInfo } from "@/utils/saveStorage";
import TextInput from "../../components/TextInput";
import GenderToggle from "../GenderToggle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlayerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { players, setPlayers } = useContext(AppContext);

  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.未設定);

  const textInputRef = useRef<TextInputOrigin>(null);

  const addPlayer = (): void => {
    if (name.trim() === "") return;

    const existingIds = players.map((player) => player.id);
    const newId = generateUniqId(existingIds);

    const newPlayer: Player = {
      id: newId,
      name: name,
      gender: gender,
      matchCount: 0,
      isJoin: true,
      isRest: false,
      rank: Rank.未設定,
    };

    const newPlayers = [...players, newPlayer];
    setPlayers(newPlayers);
    resetInput();

    savePlayerInfo(
      newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
          gender: player.gender,
          rank: player.rank,
        };
      })
    );
    onClose();
  };

  const resetInput = () => {
    setName("");
    setGender(Gender.未設定);
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
              <TouchableOpacity onPress={addPlayer} style={styles.headerButton}>
                <Text
                  style={[
                    styles.headerButtonText,
                    name.trim() === "" && { color: Colors.muted },
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
                onSubmitEditing={() => setName}
                clearInput={() => setName("")}
              />
              <Text>性別</Text>
              <GenderToggle value={gender} setGender={setGender} />
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
    backgroundColor: Colors.transparent,
  },
  modalContainer: {
    minHeight: Dimensions.get("window").height * 0.8,
    backgroundColor: Colors.background,
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
    fontSize: 16,
    color: Colors.link,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    height: 48,
    borderColor: Colors.borderline,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
});

export default AddPlayerModal;
