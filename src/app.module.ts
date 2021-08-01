import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

//Module: Root Module of Application: Starting Point of App
//Singletons: Can be imported by other modules [Read Design Patterns]
//Decorators provide MetaData for NestJS to get app structure
//nest g module app, nest g --help: Schematic!

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.STAGE.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
  ], //Imported from other module by Dependency Injection
})
export class AppModule {}
//Services: Not all providers are services
//Wrapped as singletons - Services have the business logic
