import { Controller, Get } from "@nestjs/common";
import { PolygonService } from './polygon.service';

@Controller('polygon')
export class PolygonController {
  constructor(private readonly polygonService: PolygonService) {}

  @Get('balance')
  async getBalance() {
    return await this.polygonService.getBalance();
  }
}
