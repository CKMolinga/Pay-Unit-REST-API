import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HeadersService {
  constructor(private configService: ConfigService) {}

  setHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${this.configService.get('Authorization')}`,
        ).toString('base64')}`,
        'x-api-key': `${this.configService.get('API_KEY')}`,
        mode: this.configService.get('MODE'),
      },
    };
  }

  baseUrl() {
    return this.configService.get('BASE_URL');
  }

  localUrl() {
    return this.configService.get('LOCAL_URL');
  }
}
