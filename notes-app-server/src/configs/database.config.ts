function stringWithoutNumeric(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; ++i) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: parseInt(process.env.APP_PORT, 10),
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT, 10),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  APP_ENABLE_LOGGING:
    String(process.env.APP_ENABLE_LOGGING).toLowerCase() === 'true',
});

export const getTypeOrmConfig = () => {
  const isTest = process.env.NODE_ENV === 'test';
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: isTest ? stringWithoutNumeric(5) : process.env.DB_DATABASE,
    entities: [
      isTest ? 'src/entities/*.entity.ts' : 'dist/entities/*.entity.js',
    ],
    migrationsTableName: 'migrations',
    migrations: ['dist/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    // For faster develop
    synchronize: true,
    logging: isTest ? false : !!process.env.APP_ENABLE_LOGGING,
  };
};
