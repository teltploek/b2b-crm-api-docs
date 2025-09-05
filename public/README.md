# API Documentation

This directory contains the complete API specification for the B2B CRM Dashboard backend.

## Documentation Structure

### 📁 Core Documentation
- **[database-schema.md](./database-schema.md)** - Complete database schema with all tables, relationships, and constraints
- **[api-endpoints.md](./api-endpoints.md)** - All REST API endpoints with request/response examples

## Quick Navigation

### Authentication & Users
- [Authentication Endpoints](./api-endpoints.md#authentication)
- [User Management](./api-endpoints.md#user-management)
- [Feature Flags](./api-endpoints.md#feature-flags)

### HR Module
- [Employee Management](./api-endpoints.md#hr-module---employees)
- [Schedule Templates](./api-endpoints.md#hr-module---schedule-templates)
- [Work Shifts](./api-endpoints.md#hr-module---shifts)
- [Day Events](./api-endpoints.md#hr-module---events)

### Sales Module
- [Customer Management](./api-endpoints.md#sales-module---customers)
- [Sales Requests](./api-endpoints.md#sales-module---requests)

### Orders Module
- [Order Management](./api-endpoints.md#orders-module)
- [Order Status Tracking](./api-endpoints.md#orders-module)

### Finance Module
- [Invoice Management](./api-endpoints.md#finance-module---invoices)
- [Payment Processing](./api-endpoints.md#finance-module---payments)

### System Configuration
- [System Settings](./api-endpoints.md#system-configuration)

## Implementation Status

✅ **Completed:**
- Database schema fully documented
- All CRUD endpoints specified
- Authentication flow defined
- Error handling standards established
- Request/response examples provided

⏳ **Ready for Backend Implementation:**
- All endpoints ready for development
- Database can be created from schema
- Mock API in frontend can be replaced

## Key Features

1. **RESTful Design** - Standard REST conventions with proper HTTP methods
2. **JWT Authentication** - Token-based auth with refresh tokens
3. **Role-Based Access** - Feature flags for module access control
4. **Comprehensive Error Handling** - Standardized error responses
5. **Pagination Support** - Consistent pagination across list endpoints

## For Backend Developers

1. Start with [database-schema.md](./database-schema.md) to create the database
2. Implement authentication endpoints first
3. Build modules in this order: HR → Sales → Orders → Finance
4. Use the mock API in `/crm-dashboard/src/lib/mock-api.ts` as reference for business logic
5. All endpoints return JSON with consistent structure

## API Base URL

Development: `http://localhost:3001/api/v1`  
Production: `https://api.b2bpromotion.com/api/v1`

## Version

Current API Version: **v1.0**  
Last Updated: September 5, 2025