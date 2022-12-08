import { RangesType } from '@interfaces/range.interface';
import { gray, green, red } from './colors';

const ranges: RangesType[] = [
  // temperature
  {
    level_1: {
      value: 18,
      color: gray,
    },
    level_2: {
      value: 30,
      color: green,
    },
    level_3: {
      value: 100,
      color: red,
    },
    // humidity
  },
  {
    level_1: {
      value: 40,
      color: gray,
    },
    level_2: {
      value: 60,
      color: green,
    },
    level_3: {
      value: 100,
      color: red,
    },
  },
  // moisture
  {
    level_1: {
      value: 25,
      color: red,
    },
    level_2: {
      value: 60,
      color: green,
    },
    level_3: {
      value: 100,
      color: gray,
    },
  },
];

export default ranges;
