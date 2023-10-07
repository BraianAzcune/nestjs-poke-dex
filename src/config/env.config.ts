export const EnvConfig = () => ({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  MONGODB: process.env.MONGODB,
  // el 3001 nunca se usara ya que joi gana de prioridad, pero joi envia strings asi que la conversion es necesaria
  PORT: process.env.PORT || 3001,
  DEFAULT_LIMIT: +process.env.DEFAULT_LIMIT || 7,
});
