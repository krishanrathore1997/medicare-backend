import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Get('db')
  async checkDatabases() {
    const sqlStatus = await this.checkPostgres();
    const mongoStatus = this.checkMongo();

    return { postgres: sqlStatus, mongo: mongoStatus };
  }

  private async checkPostgres() {
    try {
      await this.dataSource.query('SELECT 1');
      return 'connected ✅';
    } catch (error) {
      return `not connected ❌ (${error.message})`;
    }
  }

  private checkMongo() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[this.mongoConnection.readyState] || 'unknown';
  }
}
