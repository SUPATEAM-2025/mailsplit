# Testing Documentation

This document describes the testing setup and conventions for the MailSplit application.

## Test Framework

We use **Jest** with **React Testing Library** for testing React components and API routes.

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### CI Mode
```bash
npm run test:ci
```

## Test Structure

```
__tests__/
├── setup/
│   ├── mocks.ts          # Mock data and utilities
│   └── test-utils.tsx    # Custom render functions and utilities
├── api/
│   ├── teams.test.ts     # Tests for /api/teams routes
│   └── emails.test.ts    # Tests for /api/emails routes
├── components/
│   ├── TeamList.test.tsx
│   ├── TeamForm.test.tsx
│   ├── EmailList.test.tsx
│   ├── EmailDetail.test.tsx
│   └── DocumentUpload.test.tsx
└── lib/
    └── supabase.test.ts  # Tests for Supabase utilities
```

## Test Coverage

Our tests cover:

### API Routes
- ✅ GET /api/teams - Fetching all teams
- ✅ POST /api/teams - Creating new teams
- ✅ GET /api/emails - Fetching all emails
- ✅ POST /api/emails - Creating new emails
- ✅ Error handling for all routes
- ✅ Database integration

### Components

#### TeamList
- ✅ Rendering teams
- ✅ Displaying team details
- ✅ Opening create/edit forms
- ✅ Document upload dialog
- ✅ Navigation to team details

#### TeamForm
- ✅ Form rendering with/without initial data
- ✅ Form submission
- ✅ API integration
- ✅ Error handling
- ✅ Comma-separated list parsing

#### EmailList
- ✅ Rendering email list
- ✅ Displaying email details
- ✅ Team assignment display
- ✅ Date formatting
- ✅ Navigation to email details

#### EmailDetail
- ✅ Rendering email content
- ✅ Team assignment selection
- ✅ Notes editing
- ✅ Auto-save functionality (with debouncing)
- ✅ Loading states
- ✅ Error handling

#### DocumentUpload
- ✅ File upload UI
- ✅ Drag and drop
- ✅ File type validation
- ✅ Upload progress
- ✅ Error handling
- ✅ Multiple file format support (PDF, TXT, DOCX, MD)

### Utilities
- ✅ Supabase client initialization
- ✅ Company management functions

## Writing Tests

### Component Test Example

```tsx
import { render, screen, fireEvent } from '../setup/test-utils';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle clicks', () => {
    const onClick = jest.fn();
    render(<MyComponent onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### API Route Test Example

```ts
import { GET, POST } from '@/app/api/my-route/route';
import { NextRequest } from 'next/server';

describe('/api/my-route', () => {
  it('should return data', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toBeDefined();
  });
});
```

## Mocking

### Supabase Client
Supabase operations are mocked in tests to avoid hitting the real database.

### Next.js Router
The Next.js router is mocked globally in `test-utils.tsx`.

### fetch API
API calls are mocked using `global.fetch = jest.fn()`.

## Best Practices

1. **Use `screen` queries**: Prefer `screen.getByRole` over `container.querySelector`
2. **Test user behavior**: Focus on what users see and do, not implementation details
3. **Async operations**: Always use `waitFor` for async operations
4. **Clean up**: Clear mocks in `beforeEach` hooks
5. **Descriptive names**: Use clear test descriptions that explain the scenario
6. **One assertion per test**: Keep tests focused and simple

## Continuous Integration

Tests run automatically in CI with the following command:
```bash
npm run test:ci
```

This runs all tests with coverage reporting and optimized for CI environments.

## Coverage Goals

We aim for:
- **80%** overall code coverage
- **90%** coverage for critical business logic
- **100%** coverage for API routes

View current coverage:
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## Debugging Tests

### Run a specific test file
```bash
npm test -- TeamList.test.tsx
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should render"
```

### Debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome to debug.

## Common Issues

### "Cannot find module" errors
Run `npm install` to ensure all dependencies are installed.

### Timer-related test failures
Some components use timers (debouncing). Make sure to:
```ts
jest.useFakeTimers();
// ... test code
jest.advanceTimersByTime(1000);
jest.useRealTimers();
```

### Async test timeouts
Increase timeout for specific tests:
```ts
it('should work', async () => {
  // test code
}, 10000); // 10 second timeout
```

## Next Steps

Future testing improvements:
- [ ] E2E tests with Playwright
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing with axe-core
