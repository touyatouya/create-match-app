import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Option<T> = { label: string; value: T };

type Props<T> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  style?: any;
};

const SegmentControl = <T,>({ options, value, onChange, style }: Props<T>) => {
  const [layoutMap, setLayoutMap] = useState<
    Record<number, { x: number; width: number }>
  >({});
  const animX = useRef(new Animated.Value(0)).current;
  const animW = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // move indicator when layout known
    const idx = options.findIndex((o) => o.value === value);
    if (idx >= 0 && layoutMap[idx]) {
      Animated.parallel([
        Animated.timing(animX, {
          toValue: layoutMap[idx].x,
          duration: 220,
          useNativeDriver: false,
        }),
        Animated.timing(animW, {
          toValue: layoutMap[idx].width,
          duration: 220,
          useNativeDriver: false,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, layoutMap]);

  const onItemLayout = (idx: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayoutMap((prev) => {
      if (prev[idx] && prev[idx].x === x && prev[idx].width === width)
        return prev;
      return { ...prev, [idx]: { x, width } };
    });
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            left: animX,
            width: animW,
            backgroundColor: ColorPalette.checked,
          },
        ]}
      />
      {options.map((opt, idx) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={idx}
            style={styles.item}
            onPress={() => onChange(opt.value)}
            onLayout={onItemLayout(idx)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? "#fff" : ColorPalette.checked },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "transparent",
    position: "relative",
    alignItems: "center",
    padding: 6,
  },
  indicator: {
    position: "absolute",
    top: 6,
    bottom: 6,
    borderRadius: 8,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
  },
});

export default SegmentControl;
