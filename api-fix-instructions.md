# Fix for JwtAuthGuard Dependency Error in NestJS API

## Error
```
Nest can't resolve dependencies of the JwtAuthGuard (?, UserService). 
Please make sure that the argument JwtService at index [0] is available in the FinnhubModule context.
```

## Solution

Navigate to your NestJS API directory and update the `FinnhubModule`:

### 1. Update finnhub.module.ts

```typescript
import { Module } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';
import { FinnhubController } from './finnhub.controller';
import { AuthModule } from '../auth/auth.module'; // Add this import

@Module({
  imports: [AuthModule], // Add AuthModule to imports
  controllers: [FinnhubController],
  providers: [FinnhubService],
  exports: [FinnhubService],
})
export class FinnhubModule {}
```

### 2. Alternative: If AuthModule doesn't export JwtService

Update your auth.module.ts to export JwtService:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard], // Make sure JwtModule is exported
})
export class AuthModule {}
```

### 3. If you're using a shared/common module approach

Create a SharedModule that exports commonly used services:

```typescript
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class SharedModule {}
```

Then import SharedModule in your AppModule:

```typescript
import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { FinnhubModule } from './finnhub/finnhub.module';
// ... other imports

@Module({
  imports: [
    SharedModule, // Add this
    FinnhubModule,
    // ... other modules
  ],
})
export class AppModule {}
```

## Quick Fix Steps:

1. Navigate to your API directory:
   ```bash
   cd /Users/yordy/Documents/Personal/AlbeTech\ Solution/Projects/DayTradeDak/DayTradeDakApi
   ```

2. Find your FinnhubModule file:
   ```bash
   find . -name "finnhub.module.ts"
   ```

3. Update the module to import AuthModule as shown above

4. Restart your NestJS application:
   ```bash
   npm run start:dev
   ```

This should resolve the dependency injection error.