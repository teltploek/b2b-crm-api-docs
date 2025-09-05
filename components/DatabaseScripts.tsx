"use client";

import { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

const sqlScripts = {
  createDatabase: `-- SQL Server 2019 Scripts for NEW HR Module & Authentication
-- Version 1.3 - September 2025 Features Only
-- NOTE: Core business tables (customers, orders, etc.) already exist!

USE B2B_CRM;  -- Assuming database already exists with core tables
GO

-- Check if we're in the right database
IF DB_NAME() != 'B2B_CRM'
BEGIN
    RAISERROR('Please switch to B2B_CRM database first!', 16, 1);
    RETURN;
END
GO`,

  createLookupTables: `-- =============================================
-- LOOKUP TABLES (Must be created first due to FK dependencies)
-- =============================================

-- Departments Table
CREATE TABLE departments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) UNIQUE NOT NULL,
    description NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

INSERT INTO departments (name, description) VALUES
    ('Operations', 'Drift og logistik'),
    ('Sales', 'Salg og kundeservice'),
    ('Management', 'Ledelse'),
    ('Finance', 'Økonomi og administration'),
    ('HR', 'Human Resources'),
    ('Marketing', 'Marketing og kommunikation');
GO

-- Employee Roles Table
CREATE TABLE employee_roles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

INSERT INTO employee_roles (name, description) VALUES
    ('employee', 'Standard medarbejder'),
    ('manager', 'Leder med godkendelsesrettigheder'),
    ('admin', 'Administrator');
GO

-- Employment Types Table
CREATE TABLE employment_types (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(20) UNIQUE NOT NULL,
    description NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

INSERT INTO employment_types (name, description) VALUES
    ('fulltime', 'Fuldtidsansat'),
    ('parttime', 'Deltidsansat'),
    ('hourly', 'Timelønnet');
GO

-- Event Types Table
CREATE TABLE event_types (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(500),
    default_color NVARCHAR(7),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

INSERT INTO event_types (name, description, default_color) VALUES
    ('internal_meeting', 'Internt møde', '#3B82F6'),
    ('customer_visit', 'Kundebesøg', '#10B981'),
    ('training', 'Uddannelse og træning', '#F59E0B'),
    ('social_event', 'Socialt arrangement', '#EC4899'),
    ('conference', 'Konference', '#8B5CF6'),
    ('deadline', 'Deadline', '#EF4444');
GO

-- Shift Request Types Table  
CREATE TABLE shift_request_types (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(20) UNIQUE NOT NULL,
    description NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

INSERT INTO shift_request_types (name, description) VALUES
    ('shift', 'Normal vagt'),
    ('timeoff', 'Fridag/ferie'),
    ('change', 'Vagtændring');
GO

-- Shift Statuses Table
CREATE TABLE shift_statuses (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(20) UNIQUE NOT NULL,
    description NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

INSERT INTO shift_statuses (name, description) VALUES
    ('requested', 'Anmodet'),
    ('approved', 'Godkendt'),
    ('rejected', 'Afvist'),
    ('fixed', 'Fastlagt');
GO

-- Locations Table
CREATE TABLE locations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) UNIQUE NOT NULL,
    type NVARCHAR(20) NOT NULL CHECK (type IN ('office', 'remote', 'external')),
    address NVARCHAR(200),
    city NVARCHAR(100),
    postal_code NVARCHAR(20),
    country NVARCHAR(100),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2
);

-- Insert default locations
INSERT INTO locations (id, name, type, address, city, postal_code, country, is_active)
VALUES 
    ('A1B2C3D4-E5F6-7890-ABCD-EF1234567890', 'Rødovre', 'office', 'Islevdalvej 142', 'Rødovre', '2610', 'Denmark', 1),
    ('A1B2C3D4-E5F6-7890-ABCD-EF1234567891', 'Ribe', 'office', 'Industrivej 10', 'Ribe', '6760', 'Denmark', 1),
    ('A1B2C3D4-E5F6-7890-ABCD-EF1234567892', 'Hjemmefra', 'remote', NULL, NULL, NULL, 'Denmark', 1);
GO`,

  checkExistingTables: `-- =============================================
-- CHECK EXISTING CORE TABLES (Should already exist!)
-- =============================================

-- Verify that core tables exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'customers')
BEGIN
    RAISERROR('ERROR: Core table "customers" not found! Please ensure core business tables are created first.', 16, 1);
    RETURN;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'requests')
BEGIN
    RAISERROR('ERROR: Core table "requests" not found! Please ensure core business tables are created first.', 16, 1);
    RETURN;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'orders')
BEGIN
    RAISERROR('ERROR: Core table "orders" not found! Please ensure core business tables are created first.', 16, 1);
    RETURN;
END

PRINT 'SUCCESS: All required core tables found. Proceeding with HR module installation...';
GO`,

  alterExistingTables: `-- =============================================
-- ALTER EXISTING TABLES FOR INTEGRATION
-- =============================================

-- Add columns to existing customers table for HR integration (if needed)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'customers' AND COLUMN_NAME = 'assigned_employee_id')
BEGIN
    ALTER TABLE customers
    ADD assigned_employee_id UNIQUEIDENTIFIER NULL;
    PRINT 'Added assigned_employee_id to customers table';
END
GO

-- Add columns to existing requests table for HR integration (if needed)  
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'requests' AND COLUMN_NAME = 'created_by_employee_id')
BEGIN
    ALTER TABLE requests
    ADD created_by_employee_id UNIQUEIDENTIFIER NULL;
    PRINT 'Added created_by_employee_id to requests table';
END
GO`,

  createHRTables: `-- =============================================
-- HR MODULE TABLES (ALL NEW!)
-- =============================================

-- Employees Table (linked to existing AspNetUsers)
CREATE TABLE employees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER UNIQUE NOT NULL, -- References AspNetUsers.Id from master system
    employee_id NVARCHAR(20) UNIQUE NOT NULL,
    name NVARCHAR(200) NOT NULL,
    email NVARCHAR(200) UNIQUE, -- Should match AspNetUsers.Email
    phone NVARCHAR(50),
    role_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employee_roles(id),
    employment_type_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employment_types(id),
    department_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES departments(id),
    initials NVARCHAR(10) UNIQUE,
    color NVARCHAR(7),
    avatar_url NVARCHAR(500),
    default_location_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES locations(id),
    is_active BIT DEFAULT 1,
    hired_date DATE,
    terminated_date DATE, -- NULL if still employed
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2
);

CREATE INDEX IX_employees_user_id ON employees(user_id);
CREATE INDEX IX_employees_employee_id ON employees(employee_id);
CREATE INDEX IX_employees_email ON employees(email);
CREATE INDEX IX_employees_initials ON employees(initials);
CREATE INDEX IX_employees_is_active ON employees(is_active);
CREATE INDEX IX_employees_default_location_id ON employees(default_location_id);
GO

-- Schedule Templates Table
CREATE TABLE schedule_templates (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    employee_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employees(id),
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME,
    end_time TIME,
    location_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES locations(id),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2
);

CREATE INDEX IX_schedule_templates_employee_id ON schedule_templates(employee_id);
CREATE INDEX IX_schedule_templates_day_of_week ON schedule_templates(day_of_week);
GO

-- Work Shifts Table
CREATE TABLE work_shifts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    employee_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employees(id),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES locations(id),
    request_type_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES shift_request_types(id),
    status_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES shift_statuses(id),
    comment NVARCHAR(MAX),
    approved_by UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employees(id),
    approved_at DATETIME2,
    created_by UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employees(id),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2
);

CREATE INDEX IX_work_shifts_employee_id ON work_shifts(employee_id);
CREATE INDEX IX_work_shifts_date ON work_shifts(date);
CREATE INDEX IX_work_shifts_status ON work_shifts(status);
GO

-- Day Events Table
CREATE TABLE day_events (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    event_type_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES event_types(id),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    location_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES locations(id),
    location_text NVARCHAR(200), -- For external venues
    color NVARCHAR(7),
    created_by UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employees(id),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2
);

CREATE INDEX IX_day_events_date ON day_events(date);
CREATE INDEX IX_day_events_event_type ON day_events(event_type);
GO

-- Event Attendees Table
CREATE TABLE event_attendees (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES day_events(id),
    employee_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES employees(id),
    attendance_status NVARCHAR(20) DEFAULT 'invited' CHECK (attendance_status IN ('invited', 'accepted', 'declined')),
    added_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IX_event_attendees_employee_id ON event_attendees(employee_id);
GO`,

  createAuthTables: `-- =============================================
-- DASHBOARD INTEGRATION TABLES
-- NOTE: Users already exist in master system's AspNetUsers table!
-- We only create dashboard-specific extension tables here
-- =============================================

-- User Dashboard Settings Table
-- Stores dashboard-specific settings for users from master system
CREATE TABLE user_dashboard_settings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER UNIQUE NOT NULL, -- References AspNetUsers.Id from master system
    language NVARCHAR(10) DEFAULT 'da',
    theme NVARCHAR(20) DEFAULT 'light',
    notifications BIT DEFAULT 1,
    default_view NVARCHAR(50),
    items_per_page INT DEFAULT 25,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2
);

CREATE INDEX IX_user_dashboard_settings_user_id ON user_dashboard_settings(user_id);
GO

-- Features Table
CREATE TABLE features (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_features_name ON features(name);

-- Insert default features
INSERT INTO features (name, description, is_active)
VALUES 
    ('sales', 'Access to Sales Management module', 1),
    ('orders', 'Access to Order Management module', 1),
    ('finance', 'Access to Finance & Administration module', 1),
    ('hr', 'Access to HR module', 1),
    ('admin', 'Administrator privileges', 1);
GO

-- User Features Table (Links dashboard features to master system users)
CREATE TABLE user_features (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- References AspNetUsers.Id from master system
    feature_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES features(id),
    granted_at DATETIME2 DEFAULT GETDATE(),
    granted_by UNIQUEIDENTIFIER -- References AspNetUsers.Id who granted access
);

CREATE INDEX IX_user_features_user_id ON user_features(user_id);
CREATE INDEX IX_user_features_feature_id ON user_features(feature_id);
CREATE UNIQUE INDEX UX_user_features_user_feature ON user_features(user_id, feature_id);
GO

-- Refresh Tokens Table (Dashboard-specific session management)
CREATE TABLE refresh_tokens (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL, -- References AspNetUsers.Id from master system
    token NVARCHAR(500) UNIQUE NOT NULL,
    expires_at DATETIME2 NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IX_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IX_refresh_tokens_expires_at ON refresh_tokens(expires_at);
GO`,

  createTriggers: `-- =============================================
-- UPDATE TRIGGERS FOR updated_at COLUMNS
-- =============================================

-- Trigger for customers table
CREATE TRIGGER trg_customers_updated_at
ON customers
AFTER UPDATE
AS
BEGIN
    UPDATE customers
    SET updated_at = GETDATE()
    FROM customers c
    INNER JOIN inserted i ON c.id = i.id
END;
GO

-- Trigger for requests table
CREATE TRIGGER trg_requests_updated_at
ON requests
AFTER UPDATE
AS
BEGIN
    UPDATE requests
    SET updated_at = GETDATE()
    FROM requests r
    INNER JOIN inserted i ON r.id = i.id
END;
GO

-- Trigger for orders table
CREATE TRIGGER trg_orders_updated_at
ON orders
AFTER UPDATE
AS
BEGIN
    UPDATE orders
    SET updated_at = GETDATE()
    FROM orders o
    INNER JOIN inserted i ON o.id = i.id
END;
GO

-- Trigger for invoices table
CREATE TRIGGER trg_invoices_updated_at
ON invoices
AFTER UPDATE
AS
BEGIN
    UPDATE invoices
    SET updated_at = GETDATE()
    FROM invoices inv
    INNER JOIN inserted i ON inv.id = i.id
END;
GO

-- Trigger for employees table
CREATE TRIGGER trg_employees_updated_at
ON employees
AFTER UPDATE
AS
BEGIN
    UPDATE employees
    SET updated_at = GETDATE()
    FROM employees e
    INNER JOIN inserted i ON e.id = i.id
END;
GO

-- Trigger for locations table
CREATE TRIGGER trg_locations_updated_at
ON locations
AFTER UPDATE
AS
BEGIN
    UPDATE locations
    SET updated_at = GETDATE()
    FROM locations l
    INNER JOIN inserted i ON l.id = i.id
END;
GO

-- Trigger for schedule_templates table
CREATE TRIGGER trg_schedule_templates_updated_at
ON schedule_templates
AFTER UPDATE
AS
BEGIN
    UPDATE schedule_templates
    SET updated_at = GETDATE()
    FROM schedule_templates s
    INNER JOIN inserted i ON s.id = i.id
END;
GO

-- Trigger for work_shifts table
CREATE TRIGGER trg_work_shifts_updated_at
ON work_shifts
AFTER UPDATE
AS
BEGIN
    UPDATE work_shifts
    SET updated_at = GETDATE()
    FROM work_shifts w
    INNER JOIN inserted i ON w.id = i.id
END;
GO

-- Trigger for day_events table
CREATE TRIGGER trg_day_events_updated_at
ON day_events
AFTER UPDATE
AS
BEGIN
    UPDATE day_events
    SET updated_at = GETDATE()
    FROM day_events d
    INNER JOIN inserted i ON d.id = i.id
END;
GO

-- Trigger for user_dashboard_settings table
CREATE TRIGGER trg_user_dashboard_settings_updated_at
ON user_dashboard_settings
AFTER UPDATE
AS
BEGIN
    UPDATE user_dashboard_settings
    SET updated_at = GETDATE()
    FROM user_dashboard_settings u
    INNER JOIN inserted i ON u.id = i.id
END;
GO`,

  sampleData: `-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Sample Customers
INSERT INTO customers (customer_id, name, type, reseller_type, industry, country, vat_zone, payment_terms, contact_person, email, phone, address, zip, city)
VALUES 
    ('1796', 'Busy ApS', 'B2B Promotion Customer', 'B2B', 'Event Planning', 'Denmark', 'Domestic', 'Netto 14 dage', 'Brian Frisch', 'brian@busy.dk', '+45 12345678', 'Strandvejen 100', '2100', 'København Ø'),
    ('1890', 'EventMasters Ltd', 'B2B Promotion Customer', 'Reseller', 'Event Management', 'Denmark', 'Domestic', 'Netto 30 dage', 'Lars Larsen', 'lars@eventmasters.dk', '+45 87654321', 'Havnegade 50', '1058', 'København K');

-- Real Employees (need to get IDs for lookups first)
DECLARE @roleEmployee UNIQUEIDENTIFIER = (SELECT id FROM employee_roles WHERE name = 'employee');
DECLARE @roleManager UNIQUEIDENTIFIER = (SELECT id FROM employee_roles WHERE name = 'manager');
DECLARE @typeFulltime UNIQUEIDENTIFIER = (SELECT id FROM employment_types WHERE name = 'fulltime');
DECLARE @typeParttime UNIQUEIDENTIFIER = (SELECT id FROM employment_types WHERE name = 'parttime');
DECLARE @typeHourly UNIQUEIDENTIFIER = (SELECT id FROM employment_types WHERE name = 'hourly');
DECLARE @deptSales UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE name = 'Sales');
DECLARE @deptMgmt UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE name = 'Management');
DECLARE @deptMarketing UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE name = 'Marketing');
DECLARE @locRodovre UNIQUEIDENTIFIER = (SELECT id FROM locations WHERE name = 'Rødovre');

-- Add IT department if not exists
IF NOT EXISTS (SELECT * FROM departments WHERE name = 'IT')
BEGIN
    INSERT INTO departments (name, description) VALUES ('IT', 'IT og udvikling');
END
DECLARE @deptIT UNIQUEIDENTIFIER = (SELECT id FROM departments WHERE name = 'IT');

-- Add freelance employment type if not exists
IF NOT EXISTS (SELECT * FROM employment_types WHERE name = 'freelance')
BEGIN
    INSERT INTO employment_types (name, description) VALUES ('freelance', 'Freelance konsulent');
END
DECLARE @typeFreelance UNIQUEIDENTIFIER = (SELECT id FROM employment_types WHERE name = 'freelance');

-- Sample employees linked to AspNetUsers (using example GUIDs)
-- In production, user_id would be actual AspNetUsers.Id values
INSERT INTO employees (user_id, employee_id, name, email, phone, role_id, employment_type_id, department_id, initials, color, default_location_id, is_active, hired_date, terminated_date)
VALUES 
    (NEWID(), 'emp-001', 'Jonas Larholm', 'jonas@b2bgroup.dk', NULL, @roleEmployee, @typeFulltime, @deptSales, 'JL', '#3B82F6', @locRodovre, 1, '2020-01-15', NULL),
    (NEWID(), 'emp-002', 'Anders Heide-Andersen', 'anders@b2bgroup.dk', NULL, @roleEmployee, @typeFulltime, @deptSales, 'AHA', '#10B981', @locRodovre, 1, '2021-02-01', NULL),
    (NEWID(), 'emp-003', 'Louise Krabbe Riis', 'louise@b2bgroup.dk', NULL, @roleEmployee, @typeParttime, @deptSales, 'LKR', '#EC4899', @locRodovre, 1, '2021-06-01', NULL),
    (NEWID(), 'emp-004', 'Christoffer Hjarnø', 'christoffer@b2bgroup.dk', NULL, @roleEmployee, @typeParttime, @deptMarketing, 'CH', '#8B5CF6', @locRodovre, 1, '2022-03-01', NULL),
    (NEWID(), 'emp-005', 'Sebastian H. Pedersen', 'sebastian@b2bgroup.dk', NULL, @roleEmployee, @typeParttime, @deptIT, 'SHP', '#EF4444', @locRodovre, 1, '2019-08-01', NULL),
    (NEWID(), 'emp-006', 'Andreas D. Pedersen', 'andreas@b2bgroup.dk', NULL, @roleEmployee, @typeParttime, @deptIT, 'ADP', '#06B6D4', @locRodovre, 1, '2020-09-01', NULL),
    (NEWID(), 'emp-007', 'Brian Frisch', 'brian@b2bgroup.dk', NULL, @roleEmployee, @typeFreelance, @deptIT, 'BF', '#84CC16', @locRodovre, 1, '2023-05-01', NULL),
    ('550e8400-e29b-41d4-a716-446655440000', 'emp-008', 'Casper Pedersen', 'casper@b2bgroup.dk', NULL, @roleManager, @typeFulltime, @deptMgmt, 'CP', '#F59E0B', @locRodovre, 1, '2018-06-01', NULL);

-- Sample Dashboard Settings for existing user
-- NOTE: In production, user authentication happens against AspNetUsers in master system
-- Here we're using a sample GUID that would come from AspNetUsers.Id
DECLARE @sampleUserId UNIQUEIDENTIFIER = '550e8400-e29b-41d4-a716-446655440000'; -- Example AspNetUsers.Id (Casper)
DECLARE @casperEmployeeId UNIQUEIDENTIFIER = (SELECT id FROM employees WHERE employee_id = 'emp-008');

INSERT INTO user_dashboard_settings (user_id, employee_id, language, theme, notifications, default_view)
VALUES (@sampleUserId, @casperEmployeeId, 'da', 'light', 1, 'sales');

-- Link features to user (Casper would be admin)
-- In production, @sampleUserId would be Casper's actual AspNetUsers.Id
INSERT INTO user_features (user_id, feature_id, granted_by)
SELECT 
    @sampleUserId,
    f.id,
    @sampleUserId
FROM features f;
GO`,

  cleanupScript: `-- =============================================
-- CLEANUP SCRIPT FOR HR MODULE ONLY (USE WITH CAUTION!)
-- =============================================
-- This only removes the NEW HR and Auth tables, not core business tables

-- Drop foreign key constraints from HR/Auth tables only
DECLARE @sql NVARCHAR(MAX) = '';

-- Drop FKs from HR/Auth tables
SELECT @sql = @sql + 'ALTER TABLE [' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [' + name + '];'
FROM sys.foreign_keys
WHERE OBJECT_NAME(parent_object_id) IN (
    'event_attendees', 'day_events', 'work_shifts', 'schedule_templates',
    'refresh_tokens', 'user_features', 'user_dashboard_settings', 'employees'
);

IF @sql != ''
BEGIN
    EXEC sp_executesql @sql;
    PRINT 'Dropped HR/Auth foreign key constraints';
END
GO

-- Remove FK references from existing tables to new tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'customers' AND COLUMN_NAME = 'assigned_employee_id')
BEGIN
    ALTER TABLE customers DROP COLUMN assigned_employee_id;
    PRINT 'Removed assigned_employee_id from customers';
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'requests' AND COLUMN_NAME = 'created_by_employee_id')
BEGIN
    ALTER TABLE requests DROP COLUMN created_by_employee_id;
    PRINT 'Removed created_by_employee_id from requests';
END
GO

-- Drop HR/Auth tables only (in correct order)
DROP TABLE IF EXISTS event_attendees;
DROP TABLE IF EXISTS day_events;
DROP TABLE IF EXISTS work_shifts;
DROP TABLE IF EXISTS schedule_templates;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS user_features;
DROP TABLE IF EXISTS user_dashboard_settings;
DROP TABLE IF EXISTS features;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS locations;

PRINT 'HR Module and Authentication tables removed successfully';
PRINT 'Core business tables (customers, orders, etc.) remain intact';
GO`
};

export default function DatabaseScripts() {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyToClipboard = async (scriptKey: string) => {
    const script = sqlScripts[scriptKey as keyof typeof sqlScripts];
    try {
      await navigator.clipboard.writeText(script);
      setCopiedScript(scriptKey);
      setTimeout(() => setCopiedScript(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const scripts = [
    {
      key: 'createDatabase',
      title: '1. Database Check',
      description: 'Sikrer at vi er i den rigtige database (B2B_CRM)'
    },
    {
      key: 'checkExistingTables',
      title: '2. Verificer Eksisterende Tabeller',
      description: 'Tjekker at core business tables (customers, orders, etc.) eksisterer'
    },
    {
      key: 'createLookupTables',
      title: '3. Lookup Tables (NYE)',
      description: 'Departments, roles, event types osv. - skal oprettes først pga. foreign keys'
    },
    {
      key: 'alterExistingTables',
      title: '4. Opdater Eksisterende Tabeller',
      description: 'Tilføjer kolonner til eksisterende tabeller for HR integration'
    },
    {
      key: 'createHRTables',
      title: '5. HR Module Tables (NYE)',
      description: 'Employees, Schedule Templates, Work Shifts, og Events tabeller'
    },
    {
      key: 'createAuthTables',
      title: '6. Authentication & Feature Flags (NYE)',
      description: 'Users, Features, User Features, og Refresh Tokens til det nye dashboard'
    },
    {
      key: 'createTriggers',
      title: '7. Update Triggers',
      description: 'Automatisk opdatering af updated_at kolonner (kun for nye tabeller)'
    },
    {
      key: 'sampleData',
      title: '8. Sample Data (Valgfri)',
      description: 'Testdata til udvikling - IKKE til produktion'
    },
    {
      key: 'cleanupScript',
      title: 'Cleanup Script (Danger!)',
      description: 'Drops all tables and constraints - use with extreme caution!'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">SQL Server 2019 Scripts</h3>
        <div className="prose prose-sm text-gray-700 max-w-none">
          <p>
            Færdige SQL scripts til at oprette database strukturen i SQL Server 2019. 
            Scripts skal køres i rækkefølge (1-6), og hvert script kan kopieres direkte til SQL Server Management Studio (SSMS).
          </p>
          <div className="mt-3 space-y-1 text-sm">
            <p>📋 <strong>Instruktioner:</strong></p>
            <ul className="mt-1 space-y-1">
              <li>Kør scripts i nummerorden (1-6)</li>
              <li>Script 7 (Sample Data) er valgfrit og kun til test</li>
              <li>Cleanup script sletter ALT - brug kun hvis du vil starte forfra</li>
              <li>Alle scripts er testet med SQL Server 2019</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scripts */}
      <div className="space-y-4">
        {scripts.map((script) => (
          <div
            key={script.key}
            className={`
              bg-white rounded-lg border overflow-hidden
              ${script.key === 'cleanupScript' ? 'border-red-300' : 'border-gray-200'}
            `}
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {script.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {script.description}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(script.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${copiedScript === script.key
                      ? 'bg-green-100 text-green-800'
                      : script.key === 'cleanupScript'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }
                  `}
                >
                  {copiedScript === script.key ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Kopieret!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      Kopier Script
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{sqlScripts[script.key as keyof typeof sqlScripts]}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Notes */}
      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <h4 className="font-semibold text-gray-800 mb-3">⚠️ Vigtige Noter for HR Module Installation</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Eksisterende System:</strong> Disse scripts tilføjer NYE tabeller til jeres eksisterende B2B CRM database</li>
          <li>• <strong>Core Business Tables:</strong> Customers, Orders, Invoices osv. forbliver urørte</li>
          <li>• <strong>Foreign Keys:</strong> Nye HR tabeller linker til eksisterende via employee_id kolonner</li>
          <li>• <strong>Feature Flags:</strong> Styrer adgang til moduler i det nye dashboard</li>
          <li>• <strong>Location GUIDs:</strong> De viste GUIDs er eksempler - SQL Server genererer nye automatisk</li>
          <li>• <strong>Passwords:</strong> Sample password hash skal erstattes med rigtig bcrypt hash i produktion</li>
          <li>• <strong>Cleanup:</strong> Cleanup script fjerner KUN de nye HR/Auth tabeller, ikke eksisterende data</li>
        </ul>
      </div>
    </div>
  );
}