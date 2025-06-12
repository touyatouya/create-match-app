import { FlatList, StyleSheet, Text, View } from "react-native";

interface FilterProps {
  data: any[];
}

const Filter: React.FC<FilterProps> = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item}-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.restingPlayerItem}>
          <Text key={item.id} style={styles.restingPlayerName}>
            {item.name}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  restingPlayerItem: {
    alignItems: "baseline",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // borderColor: "#FFE8B2",
    flex: 1,
  },
  restingPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: "#664500",
    marginRight: 5,
  },
});

export default Filter;
