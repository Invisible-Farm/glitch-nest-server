import { Module } from '@nestjs/common';
import { PolygonModule } from './components/polygon/polygon/polygon.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PolygonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
