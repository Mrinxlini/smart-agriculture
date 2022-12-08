type RangeType = {
  value: number;
  color: [number, number, number];
};

type RangesType = {
  level_1: RangeType;
  level_2: RangeType;
  level_3: RangeType;
};

export type { RangeType, RangesType };
