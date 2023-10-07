import { Logger, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchemaEnvironmments } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      // entre EnvConfig y Joi, gana de prioridad Joi poniendo el valor por defecto si falla, y el otro vera que esta
      // pero ojo que lo trata como string todo lo que le decis aunque sea numero
      load: [EnvConfig],
      validationSchema: JoiValidationSchemaEnvironmments,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  private readonly log = new Logger(AppModule.name);
  constructor(config: ConfigService) {
    this.log.log('App running on port:' + config.get('PORT'));
  }
}
