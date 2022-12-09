import { FieldDataType } from '@interfaces/fieldData.interface';
import { RangesType } from '@interfaces/range.interface';
import { convertStrToInt } from '@utils/strToInt';

import { BsMoisture } from 'react-icons/bs';
import { TbTemperaturePlus } from 'react-icons/tb';
import { WiHumidity } from 'react-icons/wi';

const GridBox = ({
  param,
  type,
  range,
}: {
  param: FieldDataType;
  type: 'moisture' | 'temperature' | 'humidity';
  range?: RangesType;
}) => {
  const created_at = new Date(param.created_at);
  const value = convertStrToInt(param.value);
  const block = param.block;

  // filter out the range that the value falls into and get the color
  let color: [number, number, number] = [0, 0, 0];

  if (range) {
    if (value < range.level_1.value) {
      color = range.level_1.color;
    } else if (value >= range.level_1.value && value < range.level_2.value) {
      color = range.level_2.color;
    } else {
      color = range.level_3.color;
    }
  }

  let suffix: string = '';

  if (type === 'temperature') {
    suffix = '°C';
  } else if (type === 'humidity') {
    suffix = '%';
  } else if (type === 'moisture') {
    suffix = '%';
  }

  return (
    <div
      className={
        'h-44 w-44 flex flex-col gap-3 justify-center items-center text-2xl text-white font-semibold'
      }
      style={{
        backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      }}
    >
      <div className="text-3xl">
        {type === 'moisture' && <BsMoisture />}
        {type === 'temperature' && <TbTemperaturePlus />}
        {type === 'humidity' && <WiHumidity />}
      </div>

      <div>{`${value}${suffix}`}</div>
    </div>
  );
};

export default GridBox;
