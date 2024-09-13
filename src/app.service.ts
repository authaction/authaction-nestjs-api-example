import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPublicMessage(): { message: string } {
    return { message: 'This is public message!' };
  }

  getProtectedMessage(): { message: string } {
    return { message: 'This is protected message!' };
  }
}
