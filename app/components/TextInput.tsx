import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  Button,
  InputAccessoryView,
  Platform,
  StyleSheet,
  TextInput as TextInputOrigin,
  TouchableOpacity,
  View,
} from "react-native";

interface TextInputProps {
  value: string;
  onChangeText: () => void;
  onSubmitEditing: () => void;
  clearInput: () => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  clearInput,
  placeholder,
}) => {
  const inputAccessoryViewID = "uniqueID";
  const textInputRef = useRef<TextInputOrigin>(null);

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInputOrigin
          ref={textInputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize="words"
          inputAccessoryViewID={
            Platform.OS === "ios" ? inputAccessoryViewID : undefined
          }
          returnKeyType="done"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <AntDesign name="closecircle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      {/* iOS限定: キーボード上に完了ボタンを表示 */}
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.accessory}>
            <Button
              title="キャンセル"
              onPress={() => {
                textInputRef.current?.blur(); // キーボードを閉じる
              }}
            />
            <Button
              title="完了"
              onPress={() => {
                onSubmitEditing();
                textInputRef.current?.blur(); // キーボードを閉じる
              }}
            />
          </View>
        </InputAccessoryView>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          onSubmitEditing();
          textInputRef.current?.blur(); // キーボードを閉じる
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  inputContainer: {
    flex: 1,
  },
  accessory: {
    backgroundColor: "#f2f2f2",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    paddingRight: 30,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
});

export default TextInput;
