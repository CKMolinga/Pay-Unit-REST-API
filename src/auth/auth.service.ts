import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeadersService } from '../headers/headers.service';
import { Auth } from './entities/auth.entity';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private config: HeadersService,
  ) {}

  // Sign Up
  async signUp(body) {
    const { username, email, password } = body;
    const user_id = uuid();

    const signUpProperties = {
      ...body,
      user_id,
    };

    // create a new user
    try {
      const data = await axios
        .post(
          'http://localhost:8080/auth/signup',
          signUpProperties,
          this.config.setHeaders(),
        )
        .then(async (response) => {
          console.log(response.data);
          const dbData = await this.authRepository.save({
            username: username,
            email: email,
            password: password,
            user_id: user_id,
          });
          return dbData;
        });
      return data;
    } catch (error) {
      return {
        msg: error.message,
      };
    }
  }
}

// Axios makes an infinite post request
