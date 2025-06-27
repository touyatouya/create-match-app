import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
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
  filterItem: {
    alignItems: "baseline",
    backgroundColor: ColorPalette.restPlayerBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: ColorPalette.restPlayerBorder,
    flex: 1,
  },
  filterItemName: {
    marginLeft: 6,
    fontSize: FONT_SIZE.title,
    color: ColorPalette.restPlayerName,
    marginRight: 5,
  },
});

export default Filter;
