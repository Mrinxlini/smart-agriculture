import { FieldDataType } from '@interfaces/fieldData.interface';

const getFieldData = async ({ field }: { field: number }) => {
  const thingspeak_url = 'https://api.thingspeak.com/channels/1916975/fields/';

  const response = await fetch(
    thingspeak_url +
      field +
      '/last.json?api_key=' +
      process.env.NEXT_PUBLIC_THINGSPEAK_READ_API +
      '&timezone=Asia/Kolkata',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data_r = await response.json();

  let data: FieldDataType = {
    created_at: '',
    entry_id: undefined,
    value: '',
    block: '',
  };

  data['created_at'] = data_r['created_at'];
  data['entry_id'] = data_r['entry_id'];
  data['value'] = data_r['field' + field] as string;

  if (field === 5) {
    data['block'] = 'A';
  } else if (field === 6) {
    data['block'] = 'B';
  }

  return data;
};

const getAllFieldsData = async () => {
  const fields = [5, 6];

  const data: FieldDataType[] = [];

  for (let i = 0; i < fields.length; i++) {
    const field_data = await getFieldData({ field: fields[i] });
    data.push(field_data);
  }

  // console.log({ data });
  return data;
};

export { getFieldData, getAllFieldsData };
