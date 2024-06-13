import { z } from 'zod';

const configSchema = z.object({
  port: z.number({
    message: 'PORT is missing from env',
  }),
});

export type Config = z.infer<typeof configSchema>;

export default function () {
  const config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
  };

  return configSchema.parse(config);
}
