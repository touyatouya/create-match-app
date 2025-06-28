import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Filter } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NavigateLink from "../NavigateLink";

interface FilterButtonsProps {
  filteredFilters: Filter[];
  setFilteredFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}
const FilterButtons: React.FC<FilterButtonsProps> = ({
  filteredFilters,
  setFilteredFilters,
}) => {
  const { filters } = useContext(AppContext);

  const selectFilter = (id: number) => {
    setFilteredFilters((prev) => {
      if (prev.some((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id);
      } else {
        const selectedFilter = filters.find((filter) => filter.id === id);
        if (selectedFilter == null) return prev;
        else return [...prev, selectedFilter];
      }
    });
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <NavigateLink
        onPress={() =>
          router.push({
            pathname: "/components/PlayerScreen/filter-screen",
          })
        }
        text="フィルター一覧"
      />
      <View>
        <FlatList
          data={filters}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelectedFilter = filteredFilters.some(
              (filterFilter) => filterFilter.id === item.id
            );
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginRight: 8,
                  ...globalStyles.touch,
                }}
                onPress={() => selectFilter(item.id)}
              >
                <View
                  style={[
                    styles.filterItem,
                    isSelectedFilter && styles.selectedFilterItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterItemName,
                      isSelectedFilter && styles.selectedFilterItemName,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {isSelectedFilter && (
                    <AntDesign
                      name="closecircle"
                      size={16}
                      color={ColorPalette.whiteIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorPalette.filterItemBg,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: ColorPalette.secondary,
    flex: 1,
    flexDirection: "row",
    columnGap: 5,
  },
  selectedFilterItem: {
    backgroundColor: ColorPalette.secondary,
    borderStyle: "solid",
  },
  filterItemName: {
    fontSize: FONT_SIZE.body,
    color: ColorPalette.filterItemName,
  },
  selectedFilterItemName: {
    color: ColorPalette.whiteText,
  },
});

export default FilterButtons;
