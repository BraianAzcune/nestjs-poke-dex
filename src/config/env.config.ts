export const EnvConfig = () => ({
  env: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  // el 3001 nunca se usara ya que joi gana de prioridad, pero joi envia strings asi que la conversion es necesaria
  port: process.env.PORT || 3001,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7,
});
