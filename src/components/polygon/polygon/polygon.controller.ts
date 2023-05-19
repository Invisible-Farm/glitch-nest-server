import { Body, Controller, Get, Post } from "@nestjs/common";
import { PolygonService } from './polygon.service';
import { MintInput } from "./dto/polygon.dto";

@Controller('polygon')
export class PolygonController {
  constructor(private readonly polygonService: PolygonService) {}

  @Get('balance')
  async getBalance() {
    return await this.polygonService.getBalance();
  }

  @Post('mint')
  async mint(@Body() mintInput: MintInput) {
    return await this.polygonService.mint(mintInput);
  }
}
