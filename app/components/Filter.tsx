import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

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
        <View style={styles.filterItem}>
          <Text key={item.id} style={styles.filterItemName}>
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
    color: Colors.sectionTitie,
  },
  filterItem: {
    alignItems: "baseline",
    backgroundColor: Colors.restPlayerBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.restPlayerBorder,
    flex: 1,
  },
  filterItemName: {
    marginLeft: 6,
    fontSize: 24,
    color: Colors.restPlayerName,
    marginRight: 5,
  },
});

export default Filter;
