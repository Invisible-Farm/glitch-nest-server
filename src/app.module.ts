import { Module } from '@nestjs/common';
import { PolygonModule } from './components/polygon/polygon.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/config/configuration';
import { VerifierModule } from './components/verifier/verifier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PolygonModule,
    VerifierModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
