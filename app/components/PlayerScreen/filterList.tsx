import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Filter } from "@/types";
import { saveFilters } from "@/utils/saveStorage";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemoveButton from "../RemoveButton";

interface FilterListProps {
  item: Filter;
  isEdit: boolean;
}
const FilterList: React.FC<FilterListProps> = ({ item, isEdit }) => {
  const { setFilters } = useContext(AppContext);

  const removeFilter = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let newFilters: Filter[] = [];
    setFilters((prev) => {
      newFilters = prev.filter((filter) => filter.id !== id);
      return newFilters;
    });

    saveFilters(newFilters);
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() =>
          isEdit ||
          router.push({
            pathname: "/components/PlayerScreen/filter-update-screen",
            params: { filterId: item.id },
          })
        }
        style={[styles.filterItem, isEdit && { justifyContent: "flex-start" }]}
      >
        {isEdit && <RemoveButton onPress={() => removeFilter(item.id)} />}
        <Text style={styles.filterText}>{item.name}</Text>
        {isEdit || (
          <View style={styles.removeButton}>
            <AntDesign name="right" size={24} color={ColorPalette.normalIcon} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    flex: 1,
    ...globalStyles.touch,
  },
  filterText: {
    fontSize: FONT_SIZE.body,
  },
  removeButton: {
    padding: 4,
  },
});

export default FilterList;
