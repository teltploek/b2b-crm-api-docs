"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import DatabaseDiagram from './DatabaseDiagram';

interface TableColumn {
  name: string;
  type: string;
  constraints?: string;
  description?: string;
}

interface DatabaseTable {
  name: string;
  description: string;
  columns: TableColumn[];
  indexes?: string[];
  foreignKeys?: string[];
}

const databaseTables: DatabaseTable[] = [
  // Lookup Tables
  {
    name: "Departments",
    description: "Afdelinger i organisationen",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik afdelings-ID" },
      { name: "Name", type: "NVARCHAR(100)", constraints: "UNIQUE NOT NULL", description: "Afdelingsnavn" },
      { name: "Description", type: "NVARCHAR(500)", description: "Beskrivelse" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om afdelingen er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name"]
  },
  {
    name: "EmployeeRoles",
    description: "Medarbejderroller (employee, manager, admin)",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik rolle-ID" },
      { name: "Name", type: "NVARCHAR(50)", constraints: "UNIQUE NOT NULL", description: "Rollenavn" },
      { name: "Description", type: "NVARCHAR(500)", description: "Beskrivelse" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om rollen er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name"]
  },
  {
    name: "EmploymentTypes",
    description: "Ansættelsestyper (fuldtid, deltid, timelønnet, freelance)",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik type-ID" },
      { name: "Name", type: "NVARCHAR(20)", constraints: "UNIQUE NOT NULL", description: "Typenavn" },
      { name: "Description", type: "NVARCHAR(500)", description: "Beskrivelse" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om typen er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name"]
  },
  {
    name: "EventTypes",
    description: "Begivenhedstyper for kalender",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik type-ID" },
      { name: "Name", type: "NVARCHAR(50)", constraints: "UNIQUE NOT NULL", description: "Typenavn" },
      { name: "Description", type: "NVARCHAR(500)", description: "Beskrivelse" },
      { name: "DefaultColor", type: "NVARCHAR(7)", description: "Standard farve (hex)" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om typen er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name"]
  },
  {
    name: "ShiftRequestTypes",
    description: "Vagtanmodningstyper",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik type-ID" },
      { name: "Name", type: "NVARCHAR(20)", constraints: "UNIQUE NOT NULL", description: "Typenavn" },
      { name: "Description", type: "NVARCHAR(500)", description: "Beskrivelse" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om typen er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name"]
  },
  {
    name: "ShiftStatuses",
    description: "Vagtstatusser",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik status-ID" },
      { name: "Name", type: "NVARCHAR(20)", constraints: "UNIQUE NOT NULL", description: "Statusnavn" },
      { name: "Description", type: "NVARCHAR(500)", description: "Beskrivelse" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om status er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name"]
  },
  // HR Module Tables
  {
    name: "Locations",
    description: "Kontorlokationer og arbejdssteder",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik lokations-ID" },
      { name: "Name", type: "NVARCHAR(100)", constraints: "UNIQUE NOT NULL", description: "Lokationsnavn" },
      { name: "Type", type: "NVARCHAR(20)", constraints: "NOT NULL", description: "Type (office, remote, external)" },
      { name: "Address", type: "NVARCHAR(200)", description: "Gadenavn og nummer" },
      { name: "City", type: "NVARCHAR(100)", description: "By" },
      { name: "PostalCode", type: "NVARCHAR(20)", description: "Postnummer" },
      { name: "Country", type: "NVARCHAR(100)", description: "Land" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om lokationen er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" },
      { name: "UpdatedAt", type: "DATETIME2(7)", description: "Seneste opdatering" }
    ],
    indexes: ["Name", "Type", "IsActive"]
  },
  {
    name: "Employees",
    description: "Medarbejderoplysninger koblet til eksisterende AspNetUsers",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik medarbejder-ID" },
      { name: "UserId", type: "NVARCHAR(450)", constraints: "UNIQUE NOT NULL", description: "Reference til AspNetUsers.Id i master system" },
      { name: "EmployeeId", type: "NVARCHAR(20)", constraints: "UNIQUE NOT NULL", description: "Medarbejdernummer (f.eks. 'emp-001')" },
      { name: "Name", type: "NVARCHAR(200)", constraints: "NOT NULL", description: "Fuldt navn" },
      { name: "Email", type: "NVARCHAR(200)", constraints: "UNIQUE", description: "Email adresse (matcher AspNetUsers.Email)" },
      { name: "Phone", type: "NVARCHAR(50)", description: "Telefonnummer" },
      { name: "RoleId", type: "INT", constraints: "REFERENCES EmployeeRoles(Id)", description: "Reference til rolle" },
      { name: "EmploymentTypeId", type: "INT", constraints: "REFERENCES EmploymentTypes(Id)", description: "Reference til ansættelsestype" },
      { name: "DepartmentId", type: "INT", constraints: "REFERENCES Departments(Id)", description: "Reference til afdeling" },
      { name: "Initials", type: "NVARCHAR(10)", constraints: "UNIQUE", description: "Initialer" },
      { name: "Color", type: "NVARCHAR(7)", description: "Farve til kalender (hex)" },
      { name: "AvatarUrl", type: "NVARCHAR(500)", description: "Avatar billede URL" },
      { name: "DefaultLocationId", type: "INT", constraints: "REFERENCES Locations(Id)", description: "Standard arbejdssted" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om medarbejderen er aktiv" },
      { name: "HiredDate", type: "DATE", description: "Ansættelsesdato" },
      { name: "TerminatedDate", type: "DATE", description: "Fratrædelsesdato (NULL hvis stadig ansat)" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" },
      { name: "UpdatedAt", type: "DATETIME2(7)", description: "Seneste opdatering" }
    ],
    indexes: ["UserId", "EmployeeId", "Email", "Initials", "IsActive", "DefaultLocationId"],
    foreignKeys: ["UserId REFERENCES AspNetUsers(Id) (master system)", "RoleId -> EmployeeRoles(Id)", "EmploymentTypeId -> EmploymentTypes(Id)", "DepartmentId -> Departments(Id)", "DefaultLocationId -> Locations(Id)"]
  },
  {
    name: "UserDashboardSettings",
    description: "Dashboard-specifikke brugerindstillinger (én per bruger/medarbejder)",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik indstillings-ID" },
      { name: "UserId", type: "NVARCHAR(450)", constraints: "UNIQUE NOT NULL", description: "Reference til AspNetUsers.Id (samme som Employees.UserId)" },
      { name: "EmployeeId", type: "INT", constraints: "REFERENCES Employees(Id)", description: "Reference til medarbejder" },
      { name: "Language", type: "NVARCHAR(10)", constraints: "DEFAULT 'da'", description: "Foretrukket sprog (da/en/de)" },
      { name: "Theme", type: "NVARCHAR(20)", constraints: "DEFAULT 'light'", description: "Tema (light/dark)" },
      { name: "Notifications", type: "BIT", constraints: "DEFAULT 1", description: "Om notifikationer er aktiveret" },
      { name: "DefaultView", type: "NVARCHAR(50)", description: "Standard visning ved login" },
      { name: "ItemsPerPage", type: "INT", constraints: "DEFAULT 25", description: "Antal elementer per side" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" },
      { name: "UpdatedAt", type: "DATETIME2(7)", description: "Seneste opdatering" }
    ],
    indexes: ["UserId", "EmployeeId"],
    foreignKeys: ["UserId REFERENCES AspNetUsers(Id) (master system)", "EmployeeId -> Employees(Id)"]
  },
  {
    name: "Features",
    description: "System features og moduler",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik feature-ID" },
      { name: "Name", type: "NVARCHAR(50)", constraints: "UNIQUE NOT NULL", description: "Feature navn (sales, hr, admin)" },
      { name: "Description", type: "NVARCHAR(500)", description: "Feature beskrivelse" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om featuren er aktiv" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name"]
  },
  {
    name: "UserFeatures",
    description: "Dashboard feature tilknytninger for eksisterende brugere fra master system",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik tilknytnings-ID" },
      { name: "UserId", type: "NVARCHAR(450)", constraints: "NOT NULL", description: "Reference til AspNetUsers.Id i master system" },
      { name: "FeatureId", type: "INT", constraints: "REFERENCES Features(Id)", description: "Reference til feature" },
      { name: "GrantedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Tildelingstidspunkt" },
      { name: "GrantedBy", type: "NVARCHAR(450)", description: "Tildelt af bruger (AspNetUsers.Id)" }
    ],
    indexes: ["UserId", "FeatureId"],
    foreignKeys: ["UserId REFERENCES AspNetUsers(Id) (master system)", "FeatureId -> Features(Id)", "GrantedBy REFERENCES AspNetUsers(Id) (master system)"]
  },
  {
    name: "ScheduleTemplates",
    description: "Medarbejdernes ugentlige skabeloner",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik skabelon-ID" },
      { name: "EmployeeId", type: "INT", constraints: "REFERENCES Employees(Id)", description: "Reference til medarbejder" },
      { name: "DayOfWeek", type: "INT", constraints: "CHECK (DayOfWeek BETWEEN 0 AND 6)", description: "Ugedag (0=Søndag, 6=Lørdag)" },
      { name: "StartTime", type: "TIME", description: "Mødetid" },
      { name: "EndTime", type: "TIME", description: "Sluttid" },
      { name: "LocationId", type: "INT", constraints: "REFERENCES Locations(Id)", description: "Arbejdssted" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" },
      { name: "UpdatedAt", type: "DATETIME2(7)", description: "Seneste opdatering" }
    ],
    indexes: ["EmployeeId", "DayOfWeek"],
    foreignKeys: ["EmployeeId -> Employees(Id)", "LocationId -> Locations(Id)"]
  },
  {
    name: "WorkShifts",
    description: "Faktiske planlagte vagter (den aktuelle vagtplan)",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik vagt-ID" },
      { name: "EmployeeId", type: "INT", constraints: "REFERENCES Employees(Id)", description: "Reference til medarbejder" },
      { name: "Date", type: "DATE", constraints: "NOT NULL", description: "Vagtdato" },
      { name: "StartTime", type: "TIME", constraints: "NOT NULL", description: "Mødetid" },
      { name: "EndTime", type: "TIME", constraints: "NOT NULL", description: "Sluttid" },
      { name: "LocationId", type: "INT", constraints: "REFERENCES Locations(Id)", description: "Arbejdssted" },
      { name: "IsDeleted", type: "BIT", constraints: "DEFAULT 0", description: "Soft delete flag" },
      { name: "DeletedAt", type: "DATETIME2(7)", description: "Tidspunkt for sletning" },
      { name: "CreatedBy", type: "NVARCHAR(450)", constraints: "REFERENCES AspNetUsers(Id)", description: "Oprettet af bruger" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" },
      { name: "UpdatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Seneste opdatering" }
    ],
    indexes: ["EmployeeId, Date", "Date", "Date, IsDeleted WHERE IsDeleted = 0"],
    foreignKeys: ["EmployeeId -> Employees(Id)", "LocationId -> Locations(Id)", "CreatedBy REFERENCES AspNetUsers(Id)"]
  },
  {
    name: "ShiftChangeRequests",
    description: "Anmodninger om at oprette, ændre eller slette vagter",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik anmodnings-ID" },
      { name: "ShiftId", type: "INT", constraints: "REFERENCES WorkShifts(Id)", description: "Reference til vagt (NULL for nye vagter)" },
      { name: "EmployeeId", type: "INT", constraints: "REFERENCES Employees(Id)", description: "Reference til medarbejder" },
      { name: "RequestType", type: "NVARCHAR(20)", constraints: "NOT NULL", description: "Type ('new', 'edit', 'delete')" },
      { name: "Status", type: "NVARCHAR(20)", constraints: "DEFAULT 'pending'", description: "Status ('pending', 'approved', 'rejected', 'cancelled')" },
      { name: "RequestedDate", type: "DATE", description: "Ønsket vagtdato (for nye/ændrede vagter)" },
      { name: "RequestedStartTime", type: "TIME", description: "Ønsket starttid" },
      { name: "RequestedEndTime", type: "TIME", description: "Ønsket sluttid" },
      { name: "RequestedLocationId", type: "INT", constraints: "REFERENCES Locations(Id)", description: "Ønsket lokation" },
      { name: "OriginalDate", type: "DATE", description: "Original vagtdato (snapshot ved ændring/sletning)" },
      { name: "OriginalStartTime", type: "TIME", description: "Original starttid" },
      { name: "OriginalEndTime", type: "TIME", description: "Original sluttid" },
      { name: "OriginalLocationId", type: "INT", constraints: "REFERENCES Locations(Id)", description: "Original lokation" },
      { name: "Comment", type: "NVARCHAR(MAX)", description: "Medarbejders kommentar" },
      { name: "RequestedBy", type: "NVARCHAR(450)", constraints: "REFERENCES AspNetUsers(Id)", description: "Anmodet af bruger" },
      { name: "RequestedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Anmodningstidspunkt" },
      { name: "ReviewedBy", type: "NVARCHAR(450)", constraints: "REFERENCES AspNetUsers(Id)", description: "Godkendt/afvist af" },
      { name: "ReviewedAt", type: "DATETIME2(7)", description: "Godkendelsestidspunkt" },
      { name: "RejectionReason", type: "NVARCHAR(MAX)", description: "Begrundelse for afvisning" },
      { name: "AppliedAt", type: "DATETIME2(7)", description: "Når ændringen blev anvendt" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" },
      { name: "UpdatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Seneste opdatering" }
    ],
    indexes: ["Status, RequestedAt WHERE Status = 'pending'", "EmployeeId, Status", "ShiftId"],
    foreignKeys: ["ShiftId -> WorkShifts(Id)", "EmployeeId -> Employees(Id)", "RequestedLocationId -> Locations(Id)", "OriginalLocationId -> Locations(Id)", "RequestedBy REFERENCES AspNetUsers(Id)", "ReviewedBy REFERENCES AspNetUsers(Id)"]
  },
  {
    name: "ShiftRequestAudit",
    description: "Audit log for alle vagtanmodningshandlinger",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik audit-ID" },
      { name: "RequestId", type: "INT", constraints: "REFERENCES ShiftChangeRequests(Id)", description: "Reference til anmodning" },
      { name: "Action", type: "NVARCHAR(50)", constraints: "NOT NULL", description: "Handling (f.eks. 'APPROVED_NEW', 'REJECTED_DELETE')" },
      { name: "ActorId", type: "NVARCHAR(450)", constraints: "REFERENCES AspNetUsers(Id)", description: "Bruger som udførte handlingen" },
      { name: "ActorName", type: "NVARCHAR(100)", constraints: "NOT NULL", description: "Denormaliseret navn for historik" },
      { name: "Details", type: "NVARCHAR(MAX)", description: "Detaljeret JSON data" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Handlingstidspunkt" }
    ],
    indexes: ["RequestId", "ActorId", "CreatedAt"],
    foreignKeys: ["RequestId -> ShiftChangeRequests(Id)", "ActorId REFERENCES AspNetUsers(Id)"]
  },
  {
    name: "DayEvents",
    description: "Kalender begivenheder og møder",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik event-ID" },
      { name: "Date", type: "DATE", constraints: "NOT NULL", description: "Begivenhedsdato" },
      { name: "StartTime", type: "TIME", description: "Starttid" },
      { name: "EndTime", type: "TIME", description: "Sluttid" },
      { name: "EventType", type: "NVARCHAR(50)", constraints: "NOT NULL", description: "Begivenhedstype" },
      { name: "Title", type: "NVARCHAR(200)", constraints: "NOT NULL", description: "Titel" },
      { name: "Description", type: "NVARCHAR(MAX)", description: "Beskrivelse" },
      { name: "LocationId", type: "INT", constraints: "REFERENCES Locations(Id)", description: "Lokation (intern)" },
      { name: "LocationText", type: "NVARCHAR(200)", description: "Lokation (ekstern/fritekst)" },
      { name: "Color", type: "NVARCHAR(7)", description: "Farve til kalender (hex)" },
      { name: "CreatedBy", type: "INT", constraints: "REFERENCES Employees(Id)", description: "Oprettet af medarbejder" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" },
      { name: "UpdatedAt", type: "DATETIME2(7)", description: "Seneste opdatering" }
    ],
    indexes: ["Date", "EventType"],
    foreignKeys: ["LocationId -> Locations(Id)", "CreatedBy -> Employees(Id)"]
  },
  {
    name: "EventAttendees",
    description: "Deltagere til begivenheder",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik deltager-ID" },
      { name: "EventId", type: "INT", constraints: "REFERENCES DayEvents(Id)", description: "Reference til begivenhed" },
      { name: "EmployeeId", type: "INT", constraints: "REFERENCES Employees(Id)", description: "Reference til medarbejder" },
      { name: "AttendanceStatus", type: "NVARCHAR(20)", constraints: "DEFAULT 'invited'", description: "Status (invited, accepted, declined)" },
      { name: "AddedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Tilføjelsestidspunkt" }
    ],
    indexes: ["EventId", "EmployeeId"],
    foreignKeys: ["EventId -> DayEvents(Id)", "EmployeeId -> Employees(Id)"]
  },
  {
    name: "RefreshTokens",
    description: "JWT refresh tokens for dashboard session management (isoleret fra master system)",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik token-ID" },
      { name: "UserId", type: "NVARCHAR(450)", constraints: "NOT NULL", description: "Reference til AspNetUsers.Id i master system" },
      { name: "Token", type: "NVARCHAR(500)", constraints: "UNIQUE NOT NULL", description: "Refresh token" },
      { name: "ExpiresAt", type: "DATETIME2(7)", constraints: "NOT NULL", description: "Udløbstidspunkt" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["UserId", "Token", "ExpiresAt"],
    foreignKeys: ["UserId REFERENCES AspNetUsers(Id) (master system)"]
  },
  // System Logging Tables
  {
    name: "LogActionTypes",
    description: "Typer af handlinger der kan logges i systemet",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik type-ID" },
      { name: "Name", type: "NVARCHAR(50)", constraints: "UNIQUE NOT NULL", description: "Handlingsnavn (f.eks. 'user_login', 'data_export')" },
      { name: "Category", type: "NVARCHAR(50)", constraints: "NOT NULL", description: "Kategori (auth, data, admin, hr, sales, finance)" },
      { name: "Description", type: "NVARCHAR(500)", description: "Beskrivelse af handlingen" },
      { name: "Severity", type: "NVARCHAR(20)", constraints: "DEFAULT 'info'", description: "Alvorlighedsgrad (info, warning, error, critical)" },
      { name: "IsAdminOnly", type: "BIT", constraints: "DEFAULT 0", description: "Om kun admins må se denne type log" },
      { name: "IsActive", type: "BIT", constraints: "DEFAULT 1", description: "Om denne type skal logges" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Oprettelsestidspunkt" }
    ],
    indexes: ["Name", "Category", "IsAdminOnly"]
  },
  {
    name: "SystemLogs",
    description: "System log for alle handlinger i dashboard",
    columns: [
      { name: "Id", type: "INT IDENTITY(1,1)", constraints: "PRIMARY KEY", description: "Unik log-ID" },
      { name: "ActionTypeId", type: "INT", constraints: "REFERENCES LogActionTypes(Id)", description: "Reference til handlingstype" },
      { name: "UserId", type: "NVARCHAR(450)", constraints: "NOT NULL", description: "Reference til AspNetUsers.Id som udførte handlingen" },
      { name: "EmployeeId", type: "INT", constraints: "REFERENCES Employees(Id)", description: "Reference til medarbejder (hvis relevant)" },
      { name: "TargetEntity", type: "NVARCHAR(100)", description: "Hvilken entitet handlingen påvirkede (f.eks. 'order', 'customer')" },
      { name: "TargetId", type: "NVARCHAR(100)", description: "ID på den påvirkede entitet" },
      { name: "ActionDetails", type: "NVARCHAR(MAX)", description: "Detaljeret JSON data om handlingen" },
      { name: "OldValues", type: "NVARCHAR(MAX)", description: "Værdier før ændring (ved updates)" },
      { name: "NewValues", type: "NVARCHAR(MAX)", description: "Værdier efter ændring (ved updates)" },
      { name: "IpAddress", type: "NVARCHAR(45)", description: "IP adresse handlingen kom fra" },
      { name: "UserAgent", type: "NVARCHAR(500)", description: "Browser/client information" },
      { name: "RequestId", type: "NVARCHAR(100)", description: "Unik request ID for correlation" },
      { name: "ResponseStatus", type: "INT", description: "HTTP response status kode" },
      { name: "ErrorMessage", type: "NVARCHAR(MAX)", description: "Fejlbesked hvis handlingen fejlede" },
      { name: "DurationMs", type: "INT", description: "Hvor lang tid handlingen tog i millisekunder" },
      { name: "CreatedAt", type: "DATETIME2(7)", constraints: "DEFAULT GETDATE()", description: "Tidspunkt for handlingen" }
    ],
    indexes: ["ActionTypeId", "UserId", "EmployeeId", "TargetEntity", "TargetId", "CreatedAt", "ResponseStatus"],
    foreignKeys: ["ActionTypeId -> LogActionTypes(Id)", "UserId REFERENCES AspNetUsers(Id) (master system)", "EmployeeId -> Employees(Id)"]
  }
];

export default function DatabaseSection() {
  const [mainTab, setMainTab] = useState<"tables" | "diagram">("tables");
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableTabs, setTableTabs] = useState<{ [key: string]: "columns" | "sql" }>({});
  const [copiedTable, setCopiedTable] = useState<string | null>(null);
  const [copiedColumn, setCopiedColumn] = useState<string | null>(null);

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const setTableTab = (tableName: string, tab: "columns" | "sql") => {
    setTableTabs(prev => ({ ...prev, [tableName]: tab }));
  };

  const copyTableName = async (tableName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent toggling the table expansion
    try {
      await navigator.clipboard.writeText(tableName);
      setCopiedTable(tableName);
      setTimeout(() => setCopiedTable(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyColumnName = async (columnName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(columnName);
      setCopiedColumn(columnName);
      setTimeout(() => setCopiedColumn(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTableSQL = (tableName: string): string => {
    const sqlScripts: { [key: string]: string } = {
      Departments: `-- Departments Table (create before Employees table)
CREATE TABLE Departments (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_Departments PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(100) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Default departments for dashboard
INSERT INTO Departments (Name, Description) VALUES
    ('Operations', 'Drift og logistik'),
    ('Sales', 'Salg og kundeservice'),
    ('Management', 'Ledelse'),
    ('Finance', 'Økonomi og administration'),
    ('HR', 'Human Resources'),
    ('Marketing', 'Marketing og kommunikation'),
    ('IT', 'IT og udvikling');`,

      EmployeeRoles: `-- Employee Roles Table (create before Employees table)
CREATE TABLE EmployeeRoles (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_EmployeeRoles PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(50) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Default roles for dashboard
INSERT INTO EmployeeRoles (Name, Description) VALUES
    ('employee', 'Standard medarbejder'),
    ('manager', 'Leder med godkendelsesrettigheder'),
    ('admin', 'Administrator');`,

      EmploymentTypes: `-- Employment Types Table (create before Employees table)
CREATE TABLE EmploymentTypes (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_EmploymentTypes PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(20) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Default employment types for dashboard
INSERT INTO EmploymentTypes (Name, Description) VALUES
    ('fulltime', 'Fuldtidsansat'),
    ('parttime', 'Deltidsansat'),
    ('hourly', 'Timelønnet'),
    ('freelance', 'Freelance konsulent');`,

      EventTypes: `-- Event Types Table (create before DayEvents table)
CREATE TABLE EventTypes (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_EventTypes PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(50) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    DefaultColor NVARCHAR(7),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Default event types for calendar
INSERT INTO EventTypes (Name, Description, DefaultColor) VALUES
    ('internal_meeting', 'Internt møde', '#3B82F6'),
    ('customer_visit', 'Kundebesøg', '#10B981'),
    ('training', 'Uddannelse og træning', '#F59E0B'),
    ('social_event', 'Socialt arrangement', '#EC4899'),
    ('conference', 'Konference', '#8B5CF6'),
    ('deadline', 'Deadline', '#EF4444');`,

      ShiftRequestTypes: `-- Shift Request Types Table (create before WorkShifts table)
CREATE TABLE ShiftRequestTypes (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_ShiftRequestTypes PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(20) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Default shift request types
INSERT INTO ShiftRequestTypes (Name, Description) VALUES
    ('shift', 'Normal vagt'),
    ('timeoff', 'Fridag/ferie'),
    ('change', 'Vagtændring');`,

      ShiftStatuses: `-- Shift Statuses Table (create before WorkShifts table)
CREATE TABLE ShiftStatuses (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_ShiftStatuses PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(20) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Default shift statuses
INSERT INTO ShiftStatuses (Name, Description) VALUES
    ('requested', 'Anmodet'),
    ('approved', 'Godkendt'),
    ('rejected', 'Afvist'),
    ('fixed', 'Fastlagt');`,
      
      Locations: `-- Locations Table
CREATE TABLE Locations (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_Locations PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(100) UNIQUE NOT NULL,
    Type NVARCHAR(20) NOT NULL CHECK (Type IN ('office', 'remote', 'external')),
    Address NVARCHAR(200),
    City NVARCHAR(100),
    PostalCode NVARCHAR(20),
    Country NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE(),
    UpdatedAt DATETIME2(7)
);

-- Insert default locations
INSERT INTO Locations (Name, Type, Address, City, PostalCode, Country, IsActive)
VALUES 
    ('Rødovre', 'office', 'Islevdalvej 142', 'Rødovre', '2610', 'Denmark', 1),
    ('Ribe', 'office', 'Industrivej 10', 'Ribe', '6760', 'Denmark', 1),
    ('Hjemmefra', 'remote', NULL, NULL, NULL, 'Denmark', 1);

-- Note: These are the minimum required locations for the dashboard to function`,
      
      Employees: `-- Employees Table (linked to AspNetUsers)
-- Note: Each employee must have a corresponding user in AspNetUsers
CREATE TABLE Employees (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_Employees PRIMARY KEY CLUSTERED (Id),
    UserId NVARCHAR(450) UNIQUE NOT NULL, -- References AspNetUsers.Id from master system
    EmployeeId NVARCHAR(20) UNIQUE NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Email NVARCHAR(200) UNIQUE, -- Should match AspNetUsers.Email
    Phone NVARCHAR(50),
    RoleId INT FOREIGN KEY REFERENCES EmployeeRoles(Id),
    EmploymentTypeId INT FOREIGN KEY REFERENCES EmploymentTypes(Id),
    DepartmentId INT FOREIGN KEY REFERENCES Departments(Id),
    Initials NVARCHAR(10) UNIQUE,
    Color NVARCHAR(7),
    AvatarUrl NVARCHAR(500),
    DefaultLocationId INT FOREIGN KEY REFERENCES Locations(Id),
    IsActive BIT DEFAULT 1,
    HiredDate DATE,
    TerminatedDate DATE, -- NULL if still employed
    CreatedAt DATETIME2(7) DEFAULT GETDATE(),
    UpdatedAt DATETIME2(7)
);

CREATE NONCLUSTERED INDEX IX_Employees_UserId ON Employees(UserId);
CREATE NONCLUSTERED INDEX IX_Employees_EmployeeId ON Employees(EmployeeId);
CREATE NONCLUSTERED INDEX IX_Employees_Email ON Employees(Email);
CREATE NONCLUSTERED INDEX IX_Employees_Initials ON Employees(Initials);
CREATE NONCLUSTERED INDEX IX_Employees_IsActive ON Employees(IsActive);

-- Note: user_id must match an existing AspNetUsers.Id from the master system
-- Email should ideally match AspNetUsers.Email for consistency`,
      
      ScheduleTemplates: `-- Schedule Templates Table
CREATE TABLE ScheduleTemplates (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_ScheduleTemplates PRIMARY KEY CLUSTERED (Id),
    EmployeeId INT FOREIGN KEY REFERENCES Employees(Id),
    DayOfWeek INT CHECK (DayOfWeek BETWEEN 0 AND 6),
    StartTime TIME,
    EndTime TIME,
    LocationId INT FOREIGN KEY REFERENCES Locations(Id),
    CreatedAt DATETIME2(7) DEFAULT GETDATE(),
    UpdatedAt DATETIME2(7)
);

CREATE NONCLUSTERED INDEX IX_ScheduleTemplates_EmployeeId ON ScheduleTemplates(EmployeeId);
CREATE NONCLUSTERED INDEX IX_ScheduleTemplates_DayOfWeek ON ScheduleTemplates(DayOfWeek);`,
      
      WorkShifts: `-- Work Shifts Table (stores actual scheduled shifts)
CREATE TABLE WorkShifts (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_WorkShifts PRIMARY KEY CLUSTERED (Id),
    EmployeeId INT FOREIGN KEY REFERENCES Employees(Id) NOT NULL,
    Date DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    LocationId INT FOREIGN KEY REFERENCES Locations(Id) NOT NULL,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME2(7) NULL,
    CreatedBy NVARCHAR(450) NOT NULL, -- References AspNetUsers.Id
    CreatedAt DATETIME2(7) DEFAULT GETDATE(),
    UpdatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Indexes for performance
CREATE NONCLUSTERED INDEX IX_WorkShifts_EmployeeId_Date ON WorkShifts(EmployeeId, Date);
CREATE NONCLUSTERED INDEX IX_WorkShifts_Date ON WorkShifts(Date);
CREATE NONCLUSTERED INDEX IX_WorkShifts_Active ON WorkShifts(Date, IsDeleted) WHERE IsDeleted = 0;

-- Prevent overlapping shifts for same employee (using a filtered unique index)
-- Note: SQL Server doesn't have EXCLUDE constraints, so this is handled at application level
-- Alternative: Use a trigger to enforce no overlaps`,
      
      ShiftChangeRequests: `-- Shift Change Requests Table (stores all requests to modify shifts)
CREATE TABLE ShiftChangeRequests (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_ShiftChangeRequests PRIMARY KEY CLUSTERED (Id),
    ShiftId INT FOREIGN KEY REFERENCES WorkShifts(Id), -- NULL for new shift requests
    EmployeeId INT FOREIGN KEY REFERENCES Employees(Id) NOT NULL,
    RequestType NVARCHAR(20) NOT NULL CHECK (RequestType IN ('new', 'edit', 'delete')),
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (Status IN ('pending', 'approved', 'rejected', 'cancelled')),
    
    -- For new shifts or edits, store the requested values
    RequestedDate DATE,
    RequestedStartTime TIME,
    RequestedEndTime TIME,
    RequestedLocationId INT FOREIGN KEY REFERENCES Locations(Id),
    
    -- Original values (snapshot for edit/delete requests)
    OriginalDate DATE,
    OriginalStartTime TIME,
    OriginalEndTime TIME,
    OriginalLocationId INT FOREIGN KEY REFERENCES Locations(Id),
    
    -- Request metadata
    Comment NVARCHAR(MAX),
    RequestedBy NVARCHAR(450) NOT NULL, -- References AspNetUsers.Id
    RequestedAt DATETIME2(7) DEFAULT GETDATE(),
    
    -- Approval/rejection info
    ReviewedBy NVARCHAR(450), -- References AspNetUsers.Id
    ReviewedAt DATETIME2(7),
    RejectionReason NVARCHAR(MAX),
    
    -- When the change was actually applied
    AppliedAt DATETIME2(7),
    
    CreatedAt DATETIME2(7) DEFAULT GETDATE(),
    UpdatedAt DATETIME2(7) DEFAULT GETDATE()
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_ShiftChangeRequests_Status ON ShiftChangeRequests(Status, RequestedAt) WHERE Status = 'pending';
CREATE NONCLUSTERED INDEX IX_ShiftChangeRequests_EmployeeId ON ShiftChangeRequests(EmployeeId, Status);
CREATE NONCLUSTERED INDEX IX_ShiftChangeRequests_ShiftId ON ShiftChangeRequests(ShiftId);`,
      
      ShiftRequestAudit: `-- Shift Request Audit Table (audit log for all shift request actions)
CREATE TABLE ShiftRequestAudit (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_ShiftRequestAudit PRIMARY KEY CLUSTERED (Id),
    RequestId INT FOREIGN KEY REFERENCES ShiftChangeRequests(Id) NOT NULL,
    Action NVARCHAR(50) NOT NULL,
    ActorId NVARCHAR(450) NOT NULL, -- References AspNetUsers.Id
    ActorName NVARCHAR(100) NOT NULL, -- Denormalized for history
    Details NVARCHAR(MAX), -- JSON data
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

CREATE NONCLUSTERED INDEX IX_ShiftRequestAudit_RequestId ON ShiftRequestAudit(RequestId);
CREATE NONCLUSTERED INDEX IX_ShiftRequestAudit_ActorId ON ShiftRequestAudit(ActorId);
CREATE NONCLUSTERED INDEX IX_ShiftRequestAudit_CreatedAt ON ShiftRequestAudit(CreatedAt);`,
      
      DayEvents: `-- Day Events Table
CREATE TABLE DayEvents (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_DayEvents PRIMARY KEY CLUSTERED (Id),
    Date DATE NOT NULL,
    StartTime TIME,
    EndTime TIME,
    EventTypeId INT FOREIGN KEY REFERENCES EventTypes(Id),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    LocationId INT FOREIGN KEY REFERENCES Locations(Id),
    LocationText NVARCHAR(200), -- For external venues
    Color NVARCHAR(7),
    CreatedBy INT FOREIGN KEY REFERENCES Employees(Id),
    CreatedAt DATETIME2(7) DEFAULT GETDATE(),
    UpdatedAt DATETIME2(7)
);

CREATE NONCLUSTERED INDEX IX_DayEvents_Date ON DayEvents(Date);
CREATE NONCLUSTERED INDEX IX_DayEvents_EventTypeId ON DayEvents(EventTypeId);`,
      
      EventAttendees: `-- Event Attendees Table
CREATE TABLE EventAttendees (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_EventAttendees PRIMARY KEY CLUSTERED (Id),
    EventId INT FOREIGN KEY REFERENCES DayEvents(Id),
    EmployeeId INT FOREIGN KEY REFERENCES Employees(Id),
    AttendanceStatus NVARCHAR(20) DEFAULT 'invited' 
        CHECK (AttendanceStatus IN ('invited', 'accepted', 'declined')),
    AddedAt DATETIME2(7) DEFAULT GETDATE()
);

CREATE NONCLUSTERED INDEX IX_EventAttendees_EventId ON EventAttendees(EventId);
CREATE NONCLUSTERED INDEX IX_EventAttendees_EmployeeId ON EventAttendees(EmployeeId);`,
      
      
      UserDashboardSettings: `-- User Dashboard Settings Table
-- Stores dashboard-specific settings for users/employees
CREATE TABLE UserDashboardSettings (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_UserDashboardSettings PRIMARY KEY CLUSTERED (Id),
    UserId NVARCHAR(450) UNIQUE NOT NULL, -- References AspNetUsers.Id (same as Employees.UserId)
    EmployeeId INT FOREIGN KEY REFERENCES Employees(Id),
    Language NVARCHAR(10) DEFAULT 'da',
    Theme NVARCHAR(20) DEFAULT 'light',
    Notifications BIT DEFAULT 1,
    DefaultView NVARCHAR(50),
    ItemsPerPage INT DEFAULT 25,
    CreatedAt DATETIME2(7) DEFAULT GETDATE(),
    UpdatedAt DATETIME2(7)
);

CREATE NONCLUSTERED INDEX IX_UserDashboardSettings_UserId ON UserDashboardSettings(UserId);
CREATE NONCLUSTERED INDEX IX_UserDashboardSettings_EmployeeId ON UserDashboardSettings(EmployeeId);

-- Note: Create one record per user when they first access the dashboard
-- user_id must match AspNetUsers.Id from master system
-- employee_id links to the Employees table for HR features`,
      
      Features: `-- Features Table
CREATE TABLE Features (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_Features PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(50) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

CREATE NONCLUSTERED INDEX IX_Features_Name ON Features(Name);

-- Default features for dashboard navigation
INSERT INTO Features (Name, Description, IsActive)
VALUES 
    ('sales', 'Access to Sales Management module', 1),
    ('orders', 'Access to Order Management module', 1),
    ('finance', 'Access to Finance & Administration module', 1),
    ('hr', 'Access to HR module', 1),
    ('admin', 'Administrator privileges', 1);

-- Note: These features control which modules users can access in the dashboard`,
      
      
      UserFeatures: `-- User Features Table
-- Links dashboard features to users from master system  
CREATE TABLE UserFeatures (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_UserFeatures PRIMARY KEY CLUSTERED (Id),
    UserId NVARCHAR(450) NOT NULL, -- References AspNetUsers.Id from master system
    FeatureId INT FOREIGN KEY REFERENCES Features(Id),
    GrantedAt DATETIME2(7) DEFAULT GETDATE(),
    GrantedBy NVARCHAR(450) -- References AspNetUsers.Id who granted access
);

CREATE NONCLUSTERED INDEX IX_UserFeatures_UserId ON UserFeatures(UserId);
CREATE NONCLUSTERED INDEX IX_UserFeatures_FeatureId ON UserFeatures(FeatureId);
CREATE UNIQUE NONCLUSTERED INDEX UX_UserFeatures_UserId_FeatureId ON UserFeatures(UserId, FeatureId);

-- Note: user_id and granted_by reference AspNetUsers.Id in master database
-- Features control dashboard module access only`,
      
      LogActionTypes: `-- Log Action Types Table (create before SystemLogs table)
CREATE TABLE LogActionTypes (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_LogActionTypes PRIMARY KEY CLUSTERED (Id),
    Name NVARCHAR(50) UNIQUE NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    Severity NVARCHAR(20) DEFAULT 'info' CHECK (Severity IN ('info', 'warning', 'error', 'critical')),
    IsAdminOnly BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

CREATE NONCLUSTERED INDEX IX_LogActionTypes_Name ON LogActionTypes(Name);
CREATE NONCLUSTERED INDEX IX_LogActionTypes_Category ON LogActionTypes(Category);
CREATE NONCLUSTERED INDEX IX_LogActionTypes_IsAdminOnly ON LogActionTypes(IsAdminOnly);

-- Default action types for dashboard logging
INSERT INTO LogActionTypes (Name, Category, Description, Severity, IsAdminOnly) VALUES
    -- Authentication actions
    ('user_login', 'auth', 'Bruger logger ind', 'info', 0),
    ('user_logout', 'auth', 'Bruger logger ud', 'info', 0),
    ('user_login_failed', 'auth', 'Fejlet login forsøg', 'warning', 0),
    ('token_refresh', 'auth', 'Token fornyet', 'info', 0),
    ('password_changed', 'auth', 'Password ændret', 'warning', 0),
    
    -- Data actions (user visible)
    ('data_view', 'data', 'Data vist', 'info', 0),
    ('data_search', 'data', 'Søgning udført', 'info', 0),
    ('data_filter', 'data', 'Filter anvendt', 'info', 0),
    ('data_export', 'data', 'Data eksporteret', 'info', 0),
    
    -- Sales actions
    ('request_status_changed', 'sales', 'Salgsforespørgsel status ændret', 'info', 0),
    ('request_assigned', 'sales', 'Salgsforespørgsel tildelt', 'info', 0),
    ('request_commented', 'sales', 'Kommentar tilføjet', 'info', 0),
    
    -- Order actions
    ('order_status_changed', 'orders', 'Ordre status ændret', 'info', 0),
    ('order_approved', 'orders', 'Ordre godkendt', 'warning', 0),
    ('order_rejected', 'orders', 'Ordre afvist', 'warning', 0),
    
    -- Finance actions
    ('invoice_status_changed', 'finance', 'Faktura status ændret', 'info', 0),
    ('payment_registered', 'finance', 'Betaling registreret', 'warning', 0),
    
    -- HR actions
    ('shift_requested', 'hr', 'Vagt anmodet', 'info', 0),
    ('shift_approved', 'hr', 'Vagt godkendt', 'info', 0),
    ('shift_rejected', 'hr', 'Vagt afvist', 'info', 0),
    ('schedule_updated', 'hr', 'Vagtplan opdateret', 'info', 0),
    
    -- Admin only actions
    ('user_created', 'admin', 'Bruger oprettet', 'warning', 1),
    ('user_modified', 'admin', 'Bruger ændret', 'warning', 1),
    ('user_deleted', 'admin', 'Bruger slettet', 'critical', 1),
    ('permissions_changed', 'admin', 'Rettigheder ændret', 'critical', 1),
    ('system_config_changed', 'admin', 'System konfiguration ændret', 'critical', 1),
    ('bulk_data_import', 'admin', 'Bulk data importeret', 'warning', 1),
    ('bulk_data_delete', 'admin', 'Bulk data slettet', 'critical', 1),
    ('api_key_created', 'admin', 'API nøgle oprettet', 'warning', 1),
    ('api_key_revoked', 'admin', 'API nøgle tilbagekaldt', 'warning', 1);`,

      SystemLogs: `-- System Logs Table
CREATE TABLE SystemLogs (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_SystemLogs PRIMARY KEY CLUSTERED (Id),
    ActionTypeId INT FOREIGN KEY REFERENCES LogActionTypes(Id),
    UserId NVARCHAR(450) NOT NULL, -- References AspNetUsers.Id
    EmployeeId INT FOREIGN KEY REFERENCES Employees(Id),
    TargetEntity NVARCHAR(100),
    TargetId NVARCHAR(100),
    ActionDetails NVARCHAR(MAX), -- JSON data
    OldValues NVARCHAR(MAX), -- JSON data
    NewValues NVARCHAR(MAX), -- JSON data
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    RequestId NVARCHAR(100),
    ResponseStatus INT,
    ErrorMessage NVARCHAR(MAX),
    DurationMs INT,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

CREATE NONCLUSTERED INDEX IX_SystemLogs_ActionTypeId ON SystemLogs(ActionTypeId);
CREATE NONCLUSTERED INDEX IX_SystemLogs_UserId ON SystemLogs(UserId);
CREATE NONCLUSTERED INDEX IX_SystemLogs_EmployeeId ON SystemLogs(EmployeeId);
CREATE NONCLUSTERED INDEX IX_SystemLogs_TargetEntity_TargetId ON SystemLogs(TargetEntity, TargetId);
CREATE NONCLUSTERED INDEX IX_SystemLogs_CreatedAt ON SystemLogs(CreatedAt);
CREATE NONCLUSTERED INDEX IX_SystemLogs_ResponseStatus ON SystemLogs(ResponseStatus);

-- Note: All API calls should log to this table
-- User can see their own logs (filtered by user_id)
-- Admins can see all logs (filtered by is_admin_only flag on action types)`,
      
      RefreshTokens: `-- Refresh Tokens Table
-- Stores dashboard session tokens separately from master system
CREATE TABLE RefreshTokens (
    Id INT IDENTITY(1,1) NOT NULL,
    CONSTRAINT PK_RefreshTokens PRIMARY KEY CLUSTERED (Id),
    UserId NVARCHAR(450) NOT NULL, -- References AspNetUsers.Id from master system
    Token NVARCHAR(500) UNIQUE NOT NULL,
    ExpiresAt DATETIME2(7) NOT NULL,
    CreatedAt DATETIME2(7) DEFAULT GETDATE()
);

CREATE NONCLUSTERED INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
CREATE NONCLUSTERED INDEX IX_RefreshTokens_Token ON RefreshTokens(Token);
CREATE NONCLUSTERED INDEX IX_RefreshTokens_ExpiresAt ON RefreshTokens(ExpiresAt);

-- Note: user_id REFERENCES AspNetUsers(Id) in the master database
-- Tokens are isolated from master system for security`
    };
    
    return sqlScripts[tableName] || `-- No SQL script available for ${tableName}`;
  };

  const filteredTables = databaseTables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => 
      col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const tableCategories = {
    "Lookup Tables": ["Departments", "EmployeeRoles", "EmploymentTypes", "EventTypes", "ShiftRequestTypes", "ShiftStatuses"],
    "HR Module": ["Locations", "Employees", "ScheduleTemplates", "WorkShifts", "ShiftChangeRequests", "ShiftRequestAudit", "DayEvents", "EventAttendees"],
    "Dashboard Integration": ["UserDashboardSettings", "Features", "UserFeatures", "RefreshTokens"],
    "System Logging": ["LogActionTypes", "SystemLogs"]
  };

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Schema - Integration med Master System</h2>
        <div className="prose prose-sm text-gray-700 max-w-none">
          <p className="mb-3">
            Systemet bygger videre på brugerne i <code className="bg-gray-100 px-1 py-0.5 rounded">AspNetUsers</code>. 
            Dashboard-systemet udvider eksisterende brugere med dashboard-specifikke features og indstillinger.
          </p>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm">
              <strong>Naming Convention:</strong> Alle tabelnavne og kolonnenavne følger PascalCase konventionen for at matche jeres eksisterende database 
              (f.eks. tabelnavne: <code className="bg-green-100 px-1 rounded">UserDashboardSettings</code>, <code className="bg-green-100 px-1 rounded">Employees</code>; 
              kolonnenavne: <code className="bg-green-100 px-1 rounded">EmployeeId</code>, <code className="bg-green-100 px-1 rounded">CreatedAt</code>).
            </p>
          </div>
          <p>
            Oversigt over nye tabeller der skal tilføjes:
          </p>
          <ul className="mt-2 space-y-1">
            <li><strong>Lookup Tables:</strong> Opslagstabeller for afdelinger, roller, ansættelsestyper, begivenhedstyper og vagtstatusser</li>
            <li><strong>HR Module:</strong> Medarbejdere, vagtplaner, skabeloner, begivenheder, lokationer og vagtanmodninger</li>
            <li><strong>Dashboard Integration:</strong> Feature flags, brugerindstillinger og session tokens der kobles til eksisterende AspNetUsers</li>
            <li><strong>System Logging:</strong> Komplet audit trail og aktivitetslog for alle handlinger i systemet</li>
          </ul>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm">
              <strong>Integration Note:</strong> Dashboard authentication sker mod master systemets AspNetUsers tabel. 
              Vi gemmer kun dashboard-specifikke data (features, settings, refresh tokens) i vores database, 
              koblet via AspNetUsers.Id som foreign key.
            </p>
          </div>
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="text-sm">
              <strong>SQL Scripts:</strong> Alle tabeller har en &quot;SQL Script&quot; fane med CREATE TABLE statements og eksempel data. 
              Bemærk at eksempel data i mange tilfælde er påkrævet default data som systemet forventer eksisterer (f.eks. standardroller, afdelinger og lokationer).
              Scripts er en valgfri hjælp til implementering - brug dem, hvis det giver mening... på eget ansvar 😊
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setMainTab("tables")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              mainTab === "tables"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tabeller & Kolonner
          </button>
          <button
            onClick={() => setMainTab("diagram")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              mainTab === "diagram"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Visuelt Diagram
          </button>
        </nav>
      </div>

      {mainTab === "diagram" ? (
        <DatabaseDiagram />
      ) : (
        <>
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Søg efter tabel eller kolonne..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setExpandedTables(databaseTables.map(t => t.name))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Udvid alle tabeller
        </button>
        <button
          onClick={() => setExpandedTables([])}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Luk alle tabeller
        </button>
      </div>

      {/* Tables by Category */}
      {Object.entries(tableCategories).map(([category, tableNames]) => {
        const categoryTables = filteredTables.filter(t => tableNames.includes(t.name));
        
        if (categoryTables.length === 0) return null;
        
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              {category}
            </h3>
            
            {categoryTables.map((table) => {
              const isExpanded = expandedTables.includes(table.name);
              
              return (
                <div key={table.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleTable(table.name)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                      )}
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-mono text-base font-semibold text-gray-900">
                            {table.name}
                          </h4>
                          <button
                            onClick={(e) => copyTableName(table.name, e)}
                            className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-200 transition-colors"
                            title={`Kopier "${table.name}"`}
                          >
                            {copiedTable === table.name ? (
                              <CheckIcon className="h-4 w-4 text-green-600" />
                            ) : (
                              <ClipboardDocumentIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{table.description}</p>
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          <span className="inline-flex items-center gap-1">
                            {table.columns.length} kolonner • Klik for at {isExpanded ? 'skjule' : 'se'} detaljer
                          </span>
                        </p>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      {/* Tab Navigation */}
                      <div className="border-b border-gray-200 bg-gray-50">
                        <nav className="flex px-6">
                          <button
                            onClick={() => setTableTab(table.name, "columns")}
                            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                              (!tableTabs[table.name] || tableTabs[table.name] === "columns")
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Kolonner
                          </button>
                          <button
                            onClick={() => setTableTab(table.name, "sql")}
                            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                              tableTabs[table.name] === "sql"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            SQL Script
                          </button>
                        </nav>
                      </div>

                      {/* Tab Content */}
                      {(!tableTabs[table.name] || tableTabs[table.name] === "columns") ? (
                        <>
                          {/* Column Headers */}
                          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              <div className="col-span-3">Kolonnenavn</div>
                              <div className="col-span-2">Type</div>
                              <div className="col-span-3">Constraints</div>
                              <div className="col-span-4">Beskrivelse</div>
                            </div>
                          </div>

                          {/* Columns */}
                          <div className="divide-y divide-gray-100">
                            {table.columns.map((column, idx) => {
                              return (
                                <div key={idx} className="px-6 py-3 hover:bg-gray-50">
                                  <div className="grid grid-cols-12 gap-4 text-sm">
                                    <div className="col-span-3 font-mono text-gray-900 flex items-center gap-1">
                                      <button
                                        onClick={(e) => copyColumnName(column.name, e)}
                                        className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                                        title={`Kopier "${column.name}"`}
                                      >
                                        {copiedColumn === column.name ? (
                                          <CheckIcon className="h-3.5 w-3.5 text-green-600" />
                                        ) : (
                                          <ClipboardDocumentIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700" />
                                        )}
                                      </button>
                                      <span>{column.name}</span>
                                      {column.constraints?.includes("PRIMARY KEY") && (
                                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">PK</span>
                                      )}
                                      {column.constraints?.includes("REFERENCES") && (
                                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">FK</span>
                                      )}
                                    </div>
                                    <div className="col-span-2 font-mono text-gray-600 text-xs">
                                      {column.type}
                                    </div>
                                    <div className="col-span-3 text-gray-600 text-xs">
                                      {column.constraints?.replace("PRIMARY KEY", "")
                                        .replace("REFERENCES", "→")
                                        .trim() || "-"}
                                    </div>
                                    <div className="col-span-4 text-gray-700">
                                      {column.description || "-"}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Indexes and Foreign Keys */}
                          {(table.indexes || table.foreignKeys) && (
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 space-y-2">
                              {table.indexes && (
                                <div className="text-sm">
                                  <span className="font-semibold text-gray-700">Indexes:</span>{" "}
                                  <span className="font-mono text-gray-600">
                                    {table.indexes.join(", ")}
                                  </span>
                                </div>
                              )}
                              {table.foreignKeys && (
                                <div className="text-sm">
                                  <span className="font-semibold text-gray-700">Foreign Keys:</span>{" "}
                                  <span className="font-mono text-gray-600">
                                    {table.foreignKeys.join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        /* SQL Script Tab */
                        <div className="p-6">
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-xs">
                              <code>{getTableSQL(table.name)}</code>
                            </pre>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(getTableSQL(table.name));
                                // You could add a toast notification here
                              } catch (err) {
                                console.error('Failed to copy:', err);
                              }
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            Kopier SQL Script
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
        </>
      )}
    </div>
  );
}