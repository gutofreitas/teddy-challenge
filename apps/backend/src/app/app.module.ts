import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [AuthModule, ClientsModule],
  controllers: [HealthController],
})
export class AppModule {}
