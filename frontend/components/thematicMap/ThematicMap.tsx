import { FieldDataType } from '@interfaces/fieldData.interface';
import { RangesType } from '@interfaces/range.interface';
import { getAllFieldsData, getFieldData } from '@services/data.service';
import { convertStrToInt } from '@utils/strToInt';
import ranges from 'data/ranges';
import { useEffect, useState } from 'react';

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

      <div>{`${value}%`}</div>
    </div>
  );
};

const TimestampView = ({ time }: { time: Date }) => {
  return (
    <div className="text-right">
      <div>{`Last updated at ${time.toLocaleTimeString()}`}</div>
    </div>
  );
};

const ThematicMap = () => {
  const [data, setData] = useState<FieldDataType[]>([]);

  const UPDATE_INTERVAL = 5; // seconds

  useEffect(() => {
    const setFieldData = async () => {
      const data_t = await getAllFieldsData();
      setData(data_t);
    };

    setFieldData();

    const interval = setInterval(async () => {
      setFieldData();
      console.log('updated');
    }, UPDATE_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-10">
      {data.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center my-10 mx-[10%]">
          {/* row 0 - header */}
          <div className="flex flex-row justify-between gap-20 text-3xl">
            <div>Block A</div>
            <div>Block B</div>
          </div>

          <hr />

          {/* row 1 */}
          <div className="flex flex-row gap-5">
            <GridBox
              param={{ ...data[0] }}
              type={'temperature'}
              range={ranges[0]}
            />
            <GridBox
              param={{ ...data[2] }}
              type={'temperature'}
              range={ranges[0]}
            />
          </div>

          {/* row 2 */}
          <div className="flex flex-row gap-5">
            <GridBox
              param={{ ...data[1] }}
              type={'humidity'}
              range={ranges[1]}
            />
            <GridBox
              param={{ ...data[3] }}
              type={'humidity'}
              range={ranges[1]}
            />
          </div>

          {/* row 3 */}
          <div className="flex flex-row gap-5">
            <GridBox
              param={{ ...data[4] }}
              type={'moisture'}
              range={ranges[2]}
            />
            <GridBox
              param={{ ...data[5] }}
              type={'moisture'}
              range={ranges[2]}
            />
          </div>
        </div>
      )}

      {data[0]?.created_at && (
        <TimestampView time={new Date(data[0].created_at)} />
      )}
    </div>
  );
};

export default ThematicMap;
