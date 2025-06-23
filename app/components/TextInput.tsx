import Colors from "@/constants/color";
import { globalStyles } from "@/styles/global";
import { AntDesign } from "@expo/vector-icons";
import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Button,
  InputAccessoryView,
  Platform,
  StyleSheet,
  Text,
  TextInput as TextInputOrigin,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  clearInput: () => void;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  autoFocus?: boolean;
}

type Ref = {
  blur: () => void;
  focus: () => void;
};

const TextInput = forwardRef<Ref, TextInputProps>(
  (
    {
      value,
      onChangeText,
      onSubmitEditing,
      clearInput,
      placeholder,
      isError = false,
      errorMessage = "",
      autoFocus = false,
    },
    ref
  ) => {
    const inputAccessoryViewID = uuid.v4();
    const inputRef = useRef<TextInputOrigin>(null);

    // 外から ref.current?.blur() を使えるようにする
    useImperativeHandle(ref, () => ({
      blur: () => inputRef.current?.blur(),
      focus: () => inputRef.current?.focus(),
    }));

    return (
      <>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInputOrigin
              ref={inputRef}
              style={[styles.input, isError && styles.inputError]}
              placeholder={placeholder}
              placeholderTextColor={Colors.emptyText}
              value={value}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
              autoCapitalize="words"
              inputAccessoryViewID={
                Platform.OS === "ios" ? inputAccessoryViewID : undefined
              }
              returnKeyType="done"
              autoFocus={autoFocus}
            />
            {value.length > 0 && (
              <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                <AntDesign
                  name="closecircle"
                  size={20}
                  color={Colors.emptyText}
                />
              </TouchableOpacity>
            )}
          </View>
          {isError && <Text style={styles.validationText}>{errorMessage}</Text>}
        </View>
        {/* iOS限定: キーボード上に完了ボタンを表示 */}
        {Platform.OS === "ios" && (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <View style={styles.accessory}>
              <Button
                title="キャンセル"
                onPress={() => {
                  inputRef.current?.blur(); // キーボードを閉じる
                }}
              />
              <Button
                title="完了"
                onPress={() => {
                  onSubmitEditing();
                  inputRef.current?.blur(); // キーボードを閉じる
                }}
              />
            </View>
          </InputAccessoryView>
        )}
      </>
    );
  }
);

TextInput.displayName = "TextInput"; // これを追加

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  validationText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  clearButton: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: [{ translateY: -20 }],
    ...globalStyles.touch,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 8,
  },
  accessory: {
    backgroundColor: Colors.accessoryBackground,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: Colors.borderline,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    paddingRight: 30,
    ...globalStyles.touch,
  },
  inputError: {
    borderColor: "red",
  },
});

export default TextInput;
