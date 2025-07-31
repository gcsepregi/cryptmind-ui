# Environment Configuration for BASE_URL

This project uses environment-based configuration for the API BASE_URL. Here's how it works:

## Environment Files

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

## Configuration

### Development
The development environment uses `http://localhost:3000` as the BASE_URL.

### Production
Update the BASE_URL in `src/environments/environment.prod.ts` to point to your production API:

```typescript
export const environment = {
  production: true,
  BASE_URL: 'https://your-production-api.com' // Replace with your actual production API URL
};
```

## Usage in Services

Services that need to make HTTP requests can inject the BASE_URL using Angular's dependency injection:

```typescript
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor(
    private readonly http: HttpClient,
    @Inject(BASE_URL) private readonly baseUrl: string
  ) { }

  getData() {
    return this.http.get(`${this.baseUrl}/api/endpoint`);
  }
}
```

## Build Commands

- **Development**: `ng serve` (uses environment.ts)
- **Production**: `ng build --configuration=production` (uses environment.prod.ts)

The Angular CLI automatically replaces the environment file during the build process based on the configuration specified in `angular.json`. 