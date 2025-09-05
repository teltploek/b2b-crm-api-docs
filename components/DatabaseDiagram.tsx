"use client";

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function DatabaseDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      themeVariables: {
        fontSize: '12px'
      }
    });
    
    if (diagramRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  const mermaidChart = `erDiagram
    %% Master System Tables (eksisterende)
    AspNetUsers {
        string Id PK "NVARCHAR(450)"
        string UserName "NVARCHAR(256)"
        string Email "NVARCHAR(256)"
    }

    Customers {
        int CustomerId PK
        string Name
        string ContactPerson
    }

    %% Dashboard Lookup Tables (nye)
    Departments {
        int Id PK "IDENTITY"
        string Name "UNIQUE"
        bit IsActive
    }

    EmployeeRoles {
        int Id PK "IDENTITY"
        string Name "UNIQUE"
        bit IsActive
    }

    EmploymentTypes {
        int Id PK "IDENTITY"
        string Name "UNIQUE"
        bit IsActive
    }

    Locations {
        int Id PK "IDENTITY"
        string Name "UNIQUE"
        string Type
        string Address
        bit IsActive
    }

    %% Dashboard Core Tables (nye)
    Employees {
        int Id PK "IDENTITY"
        string UserId FK "AspNetUsers"
        string Name
        string Email "UNIQUE"
        int RoleId FK
        int DepartmentId FK
        int LocationId FK
        bit IsActive
    }

    UserDashboardSettings {
        int Id PK "IDENTITY"
        string UserId FK "AspNetUsers"
        int EmployeeId FK
        string Language
        string Theme
    }

    Features {
        int Id PK "IDENTITY"
        string Name "UNIQUE"
        bit IsActive
    }

    UserFeatures {
        int Id PK "IDENTITY"
        string UserId FK "AspNetUsers"
        int FeatureId FK
    }

    ScheduleTemplates {
        int Id PK "IDENTITY"
        int EmployeeId FK
        int DayOfWeek
        time StartTime
        time EndTime
        int LocationId FK
    }

    WorkShifts {
        int Id PK "IDENTITY"
        int EmployeeId FK
        date Date
        time StartTime
        time EndTime
        int LocationId FK
    }

    ShiftChangeRequests {
        int Id PK "IDENTITY"
        int ShiftId FK
        int EmployeeId FK
        string Status
        date RequestedDate
    }

    DayEvents {
        int Id PK "IDENTITY"
        date Date
        string Title
        int LocationId FK
    }

    EventAttendees {
        int Id PK "IDENTITY"
        int EventId FK
        int EmployeeId FK
    }

    RefreshTokens {
        int Id PK "IDENTITY"
        string UserId FK "AspNetUsers"
        string Token "UNIQUE"
    }

    LogActionTypes {
        int Id PK "IDENTITY"
        string Name "UNIQUE"
        string Category
    }

    SystemLogs {
        int Id PK "IDENTITY"
        int ActionTypeId FK
        string UserId FK "AspNetUsers"
        int EmployeeId FK
    }

    %% Relationships
    AspNetUsers ||--o{ Employees : "extends"
    AspNetUsers ||--o{ UserDashboardSettings : "has"
    AspNetUsers ||--o{ UserFeatures : "has"
    AspNetUsers ||--o{ RefreshTokens : "has"
    AspNetUsers ||--o{ SystemLogs : "logs"

    Employees }o--|| EmployeeRoles : "has"
    Employees }o--|| Departments : "belongs to"
    Employees }o--|| Locations : "default"
    Employees ||--o{ ScheduleTemplates : "has"
    Employees ||--o{ WorkShifts : "works"
    Employees ||--o{ ShiftChangeRequests : "requests"
    Employees ||--o{ EventAttendees : "attends"
    Employees ||--o{ SystemLogs : "logs"

    Locations ||--o{ WorkShifts : "at"
    Locations ||--o{ ScheduleTemplates : "at"
    Locations ||--o{ DayEvents : "at"

    Features ||--o{ UserFeatures : "granted"

    WorkShifts ||--o{ ShiftChangeRequests : "for"

    DayEvents ||--o{ EventAttendees : "has"

    LogActionTypes ||--o{ SystemLogs : "type"
`;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1200px] p-4 bg-white rounded-lg border border-gray-200">
        <div className="mermaid" ref={diagramRef}>
          {mermaidChart}
        </div>
      </div>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">
          <strong>Diagram Forklaring:</strong> Dette ER-diagram viser relationerne mellem dashboard tabeller og relevante master system tabeller.
        </p>
        <ul className="text-sm mt-2 space-y-1">
          <li><strong>Master System (eksisterende):</strong> <code className="bg-blue-100 px-1 rounded">AspNetUsers</code>, <code className="bg-blue-100 px-1 rounded">Customers</code> og andre business tabeller</li>
          <li><strong>Dashboard System (nye):</strong> Alle øvrige tabeller er nye dashboard-specifikke tabeller</li>
          <li><strong>Pile:</strong> Viser foreign key relationer mellem tabeller</li>
        </ul>
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> Diagrammet viser en forenklet visning. Se &quot;Tabeller & Kolonner&quot; fanen for komplet tabelstruktur med alle kolonner og datatyper.
          </p>
        </div>
      </div>
    </div>
  );
}