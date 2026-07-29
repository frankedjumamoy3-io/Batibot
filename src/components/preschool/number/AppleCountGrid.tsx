import { Image, StyleSheet, Text, View } from "react-native";

import { numberVillageAssets } from "@/src/data/preschoolNumberVillage";

export function getAppleGridLayout(count: number): { columns: number; rows: number } {
  if (count <= 1) return { columns: 1, rows: 1 };
  if (count <= 5) return { columns: count, rows: 1 };
  if (count === 6) return { columns: 3, rows: 2 };
  if (count <= 8) return { columns: 4, rows: 2 };
  if (count <= 10) return { columns: 5, rows: 2 };
  return { columns: 5, rows: 4 };
}

type AppleCountGridProps = {
  columns?: number;
  count: number;
  rows?: number;
  showNumeral?: boolean;
  showWord?: boolean;
  size?: number;
};

const WORDS: Record<number, string> = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
  13: "Thirteen",
  14: "Fourteen",
  15: "Fifteen",
  16: "Sixteen",
  17: "Seventeen",
  18: "Eighteen",
  19: "Nineteen",
  20: "Twenty",
};

export function AppleCountGrid({
  columns,
  count,
  rows,
  showNumeral = false,
  showWord = false,
  size = 42,
}: AppleCountGridProps) {
  const layout = getAppleGridLayout(count);
  const gridColumns = columns ?? layout.columns;
  const gridRows = rows ?? layout.rows;
  const extraCount = Math.max(0, count - 10);
  const useTenFrame = count > 10;

  const renderApples = (amount: number, keyPrefix: string, appleSize = size) =>
    Array.from({ length: amount }, (_, index) => (
      <Image
        key={`${keyPrefix}-${index}`}
        resizeMode="contain"
        source={numberVillageAssets.apple}
        style={{ height: appleSize, width: appleSize }}
      />
    ));

  return (
    <View style={styles.wrap}>
      {showNumeral ? <Text style={styles.numeral}>{count}</Text> : null}
      {useTenFrame ? (
        <View style={styles.tenFrameWrap}>
          <View style={[styles.tenFrameGroup, { maxWidth: 5 * (size + 2) }]}>
            {renderApples(10, `${count}-ten`, Math.max(28, size - 8))}
          </View>
          <Text style={styles.plusText}>+ {extraCount}</Text>
          <View style={[styles.extraGroup, { maxWidth: 5 * (size + 2) }]}>
            {renderApples(extraCount, `${count}-extra`, Math.max(28, size - 8))}
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.grid,
            {
              maxWidth: gridColumns * (size + 4),
              minHeight: gridRows * (size + 4),
            },
          ]}
        >
          {renderApples(count, `${count}`)}
        </View>
      )}
      {showWord ? <Text style={styles.word}>{WORDS[count]}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    alignContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    justifyContent: "center",
  },
  numeral: {
    color: "#111827",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  extraGroup: {
    alignContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
  },
  plusText: {
    color: "#681BF2",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  tenFrameGroup: {
    alignContent: "center",
    backgroundColor: "#F8FAFC",
    borderColor: "#DDD6FE",
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
    padding: 4,
  },
  tenFrameWrap: {
    alignItems: "center",
    gap: 4,
  },
  word: {
    color: "#681BF2",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
  },
});
