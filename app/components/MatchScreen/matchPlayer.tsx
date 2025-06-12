import { AppContext } from "@/context/AppContext";
import { Gender } from "@/types";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MatchPlayerProps {
  swapPlayer: number | null;
  playerId: number;
  selectSwapPlayer: (id: number) => void;
  partnerId: number | undefined;
  isEdit: boolean;
}

const MatchPlayer: React.FC<MatchPlayerProps> = ({
  swapPlayer,
  playerId,
  selectSwapPlayer,
  partnerId,
  isEdit,
}) => {
  const { players } = useContext(AppContext);

  const getPlayerName = (id: number) => {
    return players.find((player) => player.id === id)?.name;
  };

  const getGender = (id: number) => {
    return players.find((player) => player.id === id)?.gender;
  };

  const playerInfo = () => {
    return (
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{getPlayerName(playerId)}</Text>
        <Text style={styles.playerGender}>
          {getGender(playerId) === Gender.男性 ? (
            <Foundation name="male" size={24} color="blue" />
          ) : getGender(playerId) === Gender.女性 ? (
            <Foundation name="female" size={24} color="red" />
          ) : (
            ""
          )}
        </Text>
      </View>
    );
  };

  return (
    <>
      {isEdit ? (
        <TouchableOpacity
          key={playerId}
          style={
            isEdit && swapPlayer === playerId
              ? styles.swapPlayerButton
              : styles.playerButton
          }
          onPress={() => {
            isEdit && swapPlayer !== partnerId && selectSwapPlayer(playerId);
          }}
        >
          {playerInfo()}
          {isEdit && (
            <Ionicons name="swap-horizontal" size={18} color="#007BFF" />
          )}
        </TouchableOpacity>
      ) : (
        <View key={playerId} style={styles.playerButton}>
          {playerInfo()}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    paddingVertical: 16,
  },
  playerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  swapPlayerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#cc7838",
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  playerName: {
    fontSize: 24,
    color: "#333",
    fontWeight: "500",
  },
  playerGender: {
    marginRight: 8,
  },
  vsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginHorizontal: 6,
  },
});

export default MatchPlayer;
