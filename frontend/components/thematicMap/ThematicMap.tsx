import { FieldDataType } from '@interfaces/fieldData.interface';
import { getAllFieldsData, getFieldData } from '@services/data.service';
import { convertStrToInt } from '@utils/strToInt';
import { useEffect, useState } from 'react';

const GridBox = (param: FieldDataType) => {
  const created_at = new Date(param.created_at);
  const value = convertStrToInt(param.value);
  const block = param.block;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (value < 25) {
    red = 200;
    green = 0;
    blue = 0;
  } else if (value >= 25 && value < 60) {
    red = 50;
    green = 220;
    blue = 100;
  } else {
    red = 50;
    green = 120;
    blue = 250;
  }

  return (
    <div
      className={
        'h-44 w-44 flex flex-col justify-center items-center text-2xl text-white font-semibold'
      }
      style={{
        backgroundColor: `rgb(${red}, ${green}, ${blue})`,
      }}
    >
      <div>{`Block ${block}`}</div>
      <div>{`${value}%`}</div>
    </div>
  );
};

const TimestampView = ({ time }: { time: Date }) => {
  return (
    <div className="text-right">
      <div>{`*Moisture Level. Last updated at ${time.toLocaleTimeString()}`}</div>
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
    <div className="">
      <div className="flex flex-row flex-wrap gap-3 justify-center items-center my-10 mx-[10%]">
        {data.map((param, _idx) => {
          return <GridBox key={_idx} {...param} />;
        })}
      </div>

      {data[0]?.created_at && (
        <TimestampView time={new Date(data[0].created_at)} />
      )}
    </div>
  );
};

export default ThematicMap;
