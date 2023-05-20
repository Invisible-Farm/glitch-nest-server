import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifierService {
  constructor(private readonly configService: ConfigService) {}

  // async getAuthRequest(req, res)
}
