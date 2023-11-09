import { openMcp3008 } from "mcp-spi-adc";

const tempSensor = openMcp3008(5, { speedHz: 20000 }, (err: string) => {
  if (err) throw err;
});

export default defineEventHandler(async (event) => {
  let tmp = await new Promise<number | null>((resolve, reject) => {
    tempSensor.read((err: any, reading: { value: number; }) => {
      if (err) reject(err);

      resolve(reading.value);
    });
  }).catch((err) => {
    console.error(err);
  });

  return {
    tmp: tmp
  };
});