# API Versioning Guide

## Overview

PhysioGest API uses semantic versioning for both the application and API versions. All endpoints are prefixed with a version identifier (`/v1`, `/v2`, etc.).

## Current API Version

**Version**: 1.0.0  
**Released**: 2026-03-20  
**Base URL**: `http://localhost:3000/v1`

## Versioning Strategy

### URL Structure

All API endpoints follow this pattern:

```
/v[MAJOR]/[resource]
```

**Example**:
- `GET /v1/users` - Get all users (API v1)
- `POST /v1/categories` - Create category (API v1)
- `PUT /v1/settings/{id}` - Update setting (API v1)
- `DELETE /v1/payment-methods/{id}` - Delete payment method (API v1)

### Version Types

We use **Semantic Versioning** (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes to API contracts (new `/v2`, `/v3`, etc.)
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, internal improvements

### API Version Lifecycle

#### v1 (Current)

| Resource | Status | Methods |
|----------|--------|---------|
| `auth` | Active | POST /login, POST /google |
| `users` | Active | GET, POST, PUT, DELETE |
| `agendas` | Active | GET, POST, PUT, DELETE |
| `financials` | Active | GET, POST, PUT, DELETE |
| `patients` | Active | GET, POST, PUT, DELETE |
| `categories` | Active | GET, POST, PUT, DELETE |
| `payment-methods` | Active | GET, POST, PUT, DELETE |
| `settings` | Active | GET, POST, PUT, DELETE |
| `dashboard` | Active | GET |

## Backward Compatibility

### Current Behavior

Version 1.0.0 only supports `/v1` endpoints. Legacy endpoints without version prefix are not available.

### Migration Path

If breaking changes are necessary in future versions:

1. Old version remains available (e.g., `/v1/users`)
2. New version is released (e.g., `/v2/users`)
3. Deprecation period is announced (minimum 6 months)
4. Old version is eventually retired

## API Documentation

### Swagger/OpenAPI Specification

Get the full API specification in JSON format:

```
GET /swagger.json
```

### Swagger UI

Interactive API documentation is available at:

```
http://localhost:3000/docs
```

This allows you to:
- View all available endpoints
- See request/response formats
- Try API calls directly
- View authentication requirements

## Making API Calls

### Example: Using cURL

```bash
# List all categories
curl -X GET "http://localhost:3000/v1/categories" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a new category
curl -X POST "http://localhost:3000/v1/categories" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "name": "Medical expenses",
    "description": "Healthcare related costs",
    "type": "expense"
  }'
```

### Example: Using JavaScript/Fetch

```javascript
// Get user settings
const response = await fetch('http://localhost:3000/v1/settings/user-id', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

## Version History

### Version 1.0.0 (2026-03-20)

Initial release with:
- User & Patient management
- Financial transaction tracking
- Appointment scheduling
- Transaction categorization
- Payment method definitions
- User settings & dashboard configuration

See [CHANGELOG.md](CHANGELOG.md) for detailed changes.

## Support

For API issues or version-related questions:
- Check the Swagger documentation at `/docs`
- Review request/response logs in `LOG_LEVEL=debug` mode
- Enable detailed logging: `LOG_REQUEST_BODY=true LOG_RESPONSE_BODY=true`

## Version Deprecation Policy

1. **Deprecation Notice**: Announced 6+ months before retirement
2. **Grace Period**: 6 months with both old and new versions available
3. **Retirement**: Old version disabled, clients must update

Current Status: No versions marked for deprecation
