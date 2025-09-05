import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    this.logger.debug(`Request to ${request.method} ${request.url}`);
    this.logger.debug(`Authorization header: ${request.headers.authorization ? 'Present' : 'Missing'}`);
    
    if (!token) {
      this.logger.warn(`Authentication failed: No token provided for ${request.method} ${request.url}`);
      this.logger.debug(`Headers received: ${JSON.stringify(request.headers, null, 2)}`);
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      this.logger.debug(`Verifying JWT token: ${token.substring(0, 20)}...`);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'jacha-aru-secret',
      });
      
      this.logger.debug(`JWT verification successful for user: ${payload.sub} (${payload.mail})`);
      request['user'] = payload;
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error.message}`);
      this.logger.debug(`Token that failed: ${token.substring(0, 50)}...`);
      this.logger.debug(`JWT Secret being used: ${(process.env.JWT_SECRET || 'jacha-aru-secret').substring(0, 10)}...`);
      throw new UnauthorizedException('Invalid token');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    this.logger.debug(`Processing auth header: ${authHeader}`);
    
    if (!authHeader) {
      return undefined;
    }
    
    const [type, token] = authHeader.split(' ');
    this.logger.debug(`Auth type: "${type}", Token present: ${token ? 'Yes' : 'No'}`);
    
    return type === 'Bearer' ? token : undefined;
  }
}