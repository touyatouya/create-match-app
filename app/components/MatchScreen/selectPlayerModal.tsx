// import React, { useContext } from "react";
// import {
//   Dimensions,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   SectionList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// import ColorPalette from "@/constants/color";
// import { FONT_SIZE } from "@/constants/fonts";
// import { AppContext } from "@/context/AppContext";
// import { globalStyles } from "@/styles/global";
// import { Match as MatchType, Player } from "@/types";
// // import analytics from "@react-native-firebase/analytics";
// // import Constants from "expo-constants";
// import { generateUniqId } from "@/utils/createId";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import PlayerItem from "../PlayerItem";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   courtId?: number;
//   team: "teamA" | "teamB";
// }

// type Section = {
//   title: string;
//   type: "restPlayers";
//   data: Player[];
// };

// const SelectPlayerModal: React.FC<Props> = ({
//   isOpen,
//   onClose,
//   courtId,
//   team,
// }) => {
//   const { players, gameRounds, setGameRounds } = useContext(AppContext);

//   const selectPlayer = async (playerId: number): Promise<void> => {
//     const player = players.find((p) => p.id === playerId);
//     if (!player) return;

//     setGameRounds((prev) => {
//       const newGameRound = {
//         id: generateUniqId(gameRounds.map((gr) => gr.id)),
//         matches: [
//           {
//             id: generateUniqId(
//               gameRounds.flatMap((gr) => gr.matches.map((m) => m.id))
//             ),
//             teamA: team === "teamA" ? [playerId] : [],
//             teamB: team === "teamB" ? [playerId] : [],
//             courtId: courtId as number,
//             isFinished: false,
//             finishRound: null,
//           },
//         ],
//       };
//       return [...prev, newGameRound];
//     });

//     onClose();

//     // await analytics().logEvent("add_player_name", {
//     //   player_count: players.length,
//     //   court_count: courts.length,
//     //   game_count: gameRounds.length,
//     //   pairs: pairs.length,
//     //   version: Constants.expoConfig?.version,
//     // });
//   };

//   const matches: MatchType[] = gameRounds.flatMap(
//     (gameRound) => gameRound.matches
//   );

//   const notFinishedMatches = matches.filter((match) => !match.isFinished);
//   const playingPlayer = notFinishedMatches.flatMap((match) => [
//     ...match.teamA,
//     ...match.teamB,
//   ]);

//   const restPlayers = players.filter(
//     (player) => player.isRest && !playingPlayer.includes(player.id)
//   );

//   const sections: Section[] = [
//     {
//       title: "休憩中プレイヤー",
//       data: restPlayers,
//       type: "restPlayers",
//     },
//   ];

//   return (
//     <Modal visible={isOpen} animationType="slide" transparent={true}>
//       <View style={styles.modalOverlay}>
//         {/* 背景部分のみをタップ可能にして閉じる */}
//         <TouchableWithoutFeedback
//           onPress={() => {
//             onClose();
//           }}
//         >
//           <View style={styles.backgroundTouchable} />
//         </TouchableWithoutFeedback>

//         {/* モーダル本体（タップを妨げない） */}
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//           style={styles.modalContainer}
//         >
//           <View style={styles.header}>
//             <TouchableOpacity
//               onPress={() => {
//                 onClose();
//               }}
//               style={styles.headerButton}
//             >
//               <Text style={styles.headerButtonText}>キャンセル</Text>
//             </TouchableOpacity>
//             <View style={styles.modalTitleWrapper}>
//               <Text style={styles.title}>プレイヤー選択</Text>
//             </View>
//           </View>

//           <View style={styles.body}>
//             <SectionList
//               sections={sections}
//               keyExtractor={(item, index) => item.id.toString() + index}
//               renderItem={({ item, section }) =>
//                 section.type === "restPlayers" ? (
//                   <PlayerItem
//                     item={item as Player}
//                     onPress={() => selectPlayer(item.id)}
//                     isSelected={false}
//                     selectedText="選択中"
//                   />
//                 ) : null
//               }
//               renderSectionHeader={({ section }) =>
//                 section.type === "restPlayers" ? (
//                   <View style={styles.playerHeader}>
//                     <View style={styles.restingTitle}>
//                       <MaterialCommunityIcons
//                         name="human-male"
//                         size={24}
//                         color={ColorPalette.normalIcon}
//                       />
//                       <Text style={styles.restingSectionTitle}>
//                         ペア未設定プレイヤー
//                       </Text>
//                     </View>
//                   </View>
//                 ) : null
//               }
//             />
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalTitleWrapper: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     alignItems: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: ColorPalette.transparent,
//   },
//   modalContainer: {
//     minHeight: Dimensions.get("window").height * 0.8,
//     backgroundColor: ColorPalette.background,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     paddingBottom: Platform.OS === "ios" ? 40 : 20,
//   },
//   header: {
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   headerButton: {
//     ...globalStyles.touch,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerButtonText: {
//     fontSize: FONT_SIZE.body,
//     color: ColorPalette.link,
//   },
//   body: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backgroundTouchable: {
//     flex: 1,
//   },
//   buttonText: {
//     color: ColorPalette.whiteText,
//     fontSize: FONT_SIZE.body,
//     fontWeight: "bold",
//   },
//   pairHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   playerHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//     marginTop: 20,
//   },
//   restingTitle: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   restingSectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: ColorPalette.sectionTitle,
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: ColorPalette.sectionTitle,
//   },
// });

// export default SelectPlayerModal;
