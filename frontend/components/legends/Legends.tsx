import { gray, green, red } from 'data/colors';

const Legend = ({
  legend,
  color,
}: {
  legend: string;
  color: [number, number, number];
}) => {
  return (
    <div className="flex flex-row gap-3">
      <div
        className="w-10 h-6"
        style={{
          backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        }}
      ></div>
      <div>{legend}</div>
    </div>
  );
};

const LegendsView = () => {
  return (
    <div className="my-5 px-[5%] flex flex-row gap-5 justify-center">
      <Legend legend="Under Performance" color={gray} />
      <Legend legend="Optimal" color={green} />
      <Legend legend="Warning" color={red} />
    </div>
  );
};

export default LegendsView;
