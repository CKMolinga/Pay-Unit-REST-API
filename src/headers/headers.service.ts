import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HeadersService {
  constructor(private configService: ConfigService) {}

  setHeaders() {
    return {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${this.configService.get('API_AUTH')}`,
        ).toString('base64')}`,
        'Content-Type': 'application/json',
        'x-api-key': `${this.configService.get('API_KEY')}`,
        mode: this.configService.get('MODE'),
      },
    };
  }

  baseUrl() {
    return this.configService.get('BASE_URL');
  }
}
