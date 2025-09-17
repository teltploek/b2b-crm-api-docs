"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface EndpointExample {
  method: string;
  path: string;
  description: string;
  why?: string;
  queryParams?: Record<string, string>;
  requestBody?: unknown;
  responseBody: unknown;
}

interface EndpointSection {
  title: string;
  description: string;
  endpoints: EndpointExample[];
}

const endpointSections: EndpointSection[] = [
  // ============ September 2025 - New Modules ============
  {
    title: "Authentication",
    description: "Brugerautentificering og sessionshåndtering - Integration med eksisterende AspNetUsers tabel fra master system",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/login",
        description: "Autentificer bruger mod eksisterende AspNetUsers tabel. Verificerer bruger mod master system og returnerer JWT tokens med dashboard-specifikke features og rettigheder. Systemet bygger videre på brugerne i master systemet.",
        requestBody: {
          username: "casper",  // UserName from AspNetUsers
          password: "admin123"  // Validated against PasswordHash in AspNetUsers
        },
        responseBody: {
          success: true,
          user: {
            id: "550e8400-e29b-41d4-a716-446655440000",  // NVARCHAR(450) - Id from AspNetUsers master table
            username: "casper",  // UserName from AspNetUsers
            email: "casper@b2bpromotion.dk",  // Email from AspNetUsers
            employee: {  // Extended info from employees table linked via email
              id: 6,
              name: "Casper Andersen",
              role: "manager",
              department: "Sales"
            },
            dashboardFeatures: ["sales", "orders", "finance", "hr", "admin"],  // Dashboard-specific features from user_features table
            settings: {  // User-specific dashboard settings
              language: "da",
              theme: "light",
              notifications: true
            }
          },
          tokens: {
            accessToken: "eyJhbGciOiJIUzI1NiIs...",
            refreshToken: "eyJhbGciOiJIUzI1NiIs...",
            expiresIn: 3600
          }
        }
      },
      {
        method: "POST",
        path: "/api/auth/refresh",
        description: "Forny adgangstoken ved brug af refresh token. Forlænger brugerens session uden at kræve nyt login mod master systemet. Refresh tokens gemmes i dashboard database for at undgå at påvirke master systemet.",
        requestBody: {
          refreshToken: "eyJhbGciOiJIUzI1NiIs..."
        },
        responseBody: {
          success: true,
          tokens: {
            accessToken: "eyJhbGciOiJIUzI1NiIs...",
            expiresIn: 3600
          }
        }
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        description: "Log bruger ud og invalider tokens. Sikrer korrekt udlogning og invalidering af tokens for at forhindre uautoriseret adgang.",
        requestBody: {
          refreshToken: "eyJhbGciOiJIUzI1NiIs..."
        },
        responseBody: {
          success: true,
          message: "Logged out successfully"
        }
      },
      {
        method: "GET",
        path: "/api/auth/user/{userId}/features",
        description: "Hent dashboard-specifikke features for en eksisterende bruger fra master systemet. Features gemmes i dashboard database og kobles til AspNetUsers via bruger ID.",
        responseBody: {
          success: true,
          data: {
            userId: "550e8400-e29b-41d4-a716-446655440000",  // NVARCHAR(450) - References AspNetUsers.Id
            features: ["sales", "orders", "finance", "hr", "admin"],
            grantedBy: "admin-001",
            grantedAt: "2025-01-15T10:00:00Z"
          }
        }
      },
      {
        method: "PUT",
        path: "/api/auth/user/{userId}/features",
        description: "Opdater hvilke dashboard moduler en eksisterende bruger har adgang til. Dette påvirker IKKE brugerens rettigheder i master systemet.",
        requestBody: {
          features: ["sales", "orders", "finance"]  // Remove hr and admin access
        },
        responseBody: {
          success: true,
          message: "User features updated successfully"
        }
      },
      {
        method: "GET",
        path: "/api/auth/user/{userId}/settings",
        description: "Hent brugerspecifikke dashboard indstillinger som sprog, tema og notifikationer. Disse settings eksisterer kun i dashboard systemet.",
        responseBody: {
          success: true,
          data: {
            userId: "550e8400-e29b-41d4-a716-446655440000",
            settings: {
              language: "da",
              theme: "light",
              notifications: true,
              defaultView: "sales",
              itemsPerPage: 25
            }
          }
        }
      },
      {
        method: "PUT",
        path: "/api/auth/user/{userId}/settings",
        description: "Opdater brugerens personlige præferencer for dashboard visning. Disse indstillinger påvirker kun CRM dashboard, ikke master systemet.",
        requestBody: {
          language: "en",
          theme: "dark",
          notifications: false
        },
        responseBody: {
          success: true,
          message: "Settings updated successfully"
        }
      }
    ],
  },
  {
    title: "HR Module - Locations",
    description: "Kontor- og placeringshåndtering",
    endpoints: [
      {
        method: "GET",
        path: "/api/hr/locations",
        description: "Hent alle kontorplaceringer. Centraliserer håndtering af kontorplaceringer, så systemet kan skalere til flere kontorer uden hardkodning.",
        queryParams: {
          isActive: "Filter by active status (true/false)",
          type: "Filter by location type (office/remote/external)"
        },
        responseBody: {
          success: true,
          data: [
            {
              id: 1,
              name: "Rødovre",
              type: "office",
              address: "Islevdalvej 142",
              city: "Rødovre",
              postalCode: "2610",
              country: "Denmark",
              isActive: true,
              createdAt: "2025-01-01T00:00:00Z"
            },
            {
              id: 2,
              name: "Ribe",
              type: "office",
              address: "Industrivej 10",
              city: "Ribe",
              postalCode: "6760",
              country: "Denmark",
              isActive: true,
              createdAt: "2025-01-01T00:00:00Z"
            },
            {
              id: 3,
              name: "Hjemmefra",
              type: "remote",
              isActive: true,
              createdAt: "2025-01-01T00:00:00Z"
            }
          ]
        }
      },
      {
        method: "GET",
        path: "/api/hr/locations/{locationId}",
        description: "Hent detaljeret information om et kontor, inklusiv faciliteter og antal medarbejdere.",
        responseBody: {
          success: true,
          data: {
            id: 1,
            name: "Rødovre",
            type: "office",
            address: "Islevdalvej 142",
            city: "Rødovre",
            postalCode: "2610",
            country: "Denmark",
            isActive: true,
            employeeCount: 12,
            facilities: ["parking", "canteen", "meeting_rooms"],
            createdAt: "2025-01-01T00:00:00Z",
            updatedAt: "2025-09-01T10:00:00Z"
          }
        }
      },
      {
        method: "POST",
        path: "/api/hr/locations",
        description: "Opret ny placering. Gør det muligt at tilføje nye kontorer eller arbejdssteder efterhånden som virksomheden vokser.",
        requestBody: {
          name: "Copenhagen",
          type: "office",
          address: "Østergade 123",
          city: "Copenhagen",
          postalCode: "1100",
          country: "Denmark"
        },
        responseBody: {
          success: true,
          data: {
            id: 4,
            name: "Copenhagen",
            type: "office",
            address: "Østergade 123",
            city: "Copenhagen",
            postalCode: "1100",
            country: "Denmark",
            isActive: true,
            createdAt: "2025-09-05T10:00:00Z"
          }
        }
      },
      {
        method: "PUT",
        path: "/api/hr/locations/{locationId}",
        description: "Opdater placeringsdetaljer",
        requestBody: {
          address: "Islevdalvej 144",
          facilities: ["parking", "canteen", "meeting_rooms", "gym"]
        },
        responseBody: {
          success: true,
          data: {
            id: 1,
            name: "Rødovre",
            type: "office",
            address: "Islevdalvej 144",
            city: "Rødovre",
            postalCode: "2610",
            country: "Denmark",
            isActive: true,
            facilities: ["parking", "canteen", "meeting_rooms", "gym"],
            updatedAt: "2025-09-05T10:00:00Z"
          }
        }
      },
      {
        method: "DELETE",
        path: "/api/hr/locations/{locationId}",
        description: "Deaktiver placering (blød sletning)",
        responseBody: {
          success: true,
          message: "Location deactivated successfully"
        }
      }
    ],
  },
  {
    title: "HR Module - Employees", 
    description: "Medarbejderhåndtering og information",
    endpoints: [
      {
        method: "GET",
        path: "/api/hr/employees",
        description: "Hent alle medarbejdere med valgfri filtrering. Dashboardet skal kunne vise medarbejderlister og filtrere efter afdeling, rolle eller ansættelsestype.",
        queryParams: {
          isActive: "Filter by active status (true/false)",
          type: "Filter by employment type (fulltime/parttime/hourly)",
          role: "Filter by role (employee/manager)",
          department: "Filter by department"
        },
        responseBody: {
          success: true,
          data: [
            {
              id: 1,
              name: "Anders Nielsen",
              email: "anders@company.com",
              phone: "+45 20304050",
              role: "employee",
              employmentType: "fulltime",
              department: "Operations",
              initials: "AN",
              color: "#3B82F6",
              avatarUrl: "/avatars/anders.jpg",
              defaultLocation: "Rødovre",
              isActive: true,
              hiredDate: "2023-01-15",
              defaultSchedule: [
                {
                  dayOfWeek: 1,
                  startTime: "08:00",
                  endTime: "16:00",
                  locationId: 1
                }
              ]
            }
          ],
          total: 12
        }
      },
      {
        method: "GET",
        path: "/api/hr/employees/{employeeId}",
        description: "Hent specifik medarbejderdetaljer",
        responseBody: {
          success: true,
          data: {
            id: 1,
            name: "Anders Nielsen",
            email: "anders@company.com",
            phone: "+45 20304050",
            role: "employee",
            employmentType: "fulltime",
            department: "Operations",
            initials: "AN",
            color: "#3B82F6",
            avatarUrl: "/avatars/anders.jpg",
            defaultLocation: "Rødovre",
            isActive: true,
            hiredDate: "2023-01-15",
            defaultSchedule: [
              {
                dayOfWeek: 1,
                startTime: "08:00",
                endTime: "16:00",
                locationId: 1
              }
            ]
          }
        }
      },
      {
        method: "PUT",
        path: "/api/hr/employees/{employeeId}",
        description: "Opdater medarbejderinformation. HR skal kunne opdatere medarbejderoplysninger når der sker ændringer i afdeling eller kontaktinfo.",
        requestBody: {
          email: "anders.nielsen@company.com",
          phone: "+45 20304051",
          department: "Sales"
        },
        responseBody: {
          success: true,
          message: "Employee updated successfully",
          data: {
            id: 1
          }
        }
      }
    ]
  },
  {
    title: "HR Module - Schedule Templates",
    description: "Medarbejderes ugentlige vagtskabeloner",
    endpoints: [
      {
        method: "GET",
        path: "/api/hr/employees/{employeeId}/template",
        description: "Hent medarbejders vagtskabelon. Vagtplanlæggeren bruger skabelonerne som udgangspunkt for at generere ugentlige arbejdsplaner.",
        responseBody: {
          success: true,
          data: {
            employeeId: 1,
            template: [
              {
                dayOfWeek: 1,
                startTime: "08:00",
                endTime: "16:00",
                locationId: 1
              },
              {
                dayOfWeek: 2,
                startTime: "08:00",
                endTime: "16:00",
                locationId: 1
              }
            ]
          }
        }
      },
      {
        method: "PUT",
        path: "/api/hr/employees/{employeeId}/template",
        description: "Opdater medarbejders vagtskabelon. Medarbejdere kan have forskellige arbejdstider på forskellige dage, og disse skal kunne opdateres.",
        requestBody: {
          template: [
            {
              dayOfWeek: 1,
              startTime: "09:00",
              endTime: "17:00",
              locationId: 1
            },
            {
              dayOfWeek: 2,
              startTime: "09:00",
              endTime: "17:00",
              locationId: 2
            }
          ]
        },
        responseBody: {
          success: true,
          message: "Schedule template updated successfully"
        }
      }
    ]
  },
  {
    title: "HR Module - Work Shifts",
    description: "Faktiske arbejdsvagter og frihedsanmodninger",
    endpoints: [
      {
        method: "GET",
        path: "/api/hr/shifts",
        description: "Hent arbejdsvagter for datointerval. Viser vagtplaner for en given periode, så både medarbejdere og ledere kan se hvem der arbejder hvornår.",
        queryParams: {
          startDate: "Start date (YYYY-MM-DD)",
          endDate: "End date (YYYY-MM-DD)",
          employeeId: "Filter by employee",
          status: "Filter by status (requested/approved/rejected/fixed)",
          requestType: "Filter by type (shift/timeoff/change)"
        },
        responseBody: {
          success: true,
          data: [
            {
              id: 101,
              employeeId: 1,
              employeeName: "Anders Nielsen",
              date: "2025-09-05",
              startTime: "08:00",
              endTime: "16:00",
              locationId: 1,
              requestType: "shift",
              status: "approved",
              comment: null,
              approvedBy: 6,
              approvedAt: "2025-09-04T14:30:00Z",
              createdBy: 1,
              createdAt: "2025-09-03T10:00:00Z"
            }
          ],
          total: 245
        }
      },
      {
        method: "POST",
        path: "/api/hr/shifts",
        description: "Opret ny vagt eller frihedsanmodning. Medarbejdere skal kunne anmode om fridage eller bytte vagter, hvilket kræver godkendelse fra leder.",
        requestBody: {
          employeeId: 1,
          date: "2025-09-10",
          startTime: "08:00",
          endTime: "16:00",
          location: "Rødovre",
          requestType: "shift",
          status: "requested",
          comment: "Covering for Louise"
        },
        responseBody: {
          success: true,
          message: "Shift request created successfully",
          data: {
            id: 102
          }
        }
      },
      {
        method: "PUT",
        path: "/api/hr/shifts/{shiftId}/approve",
        description: "Godkend eller afvis vagtanmodning. Ledere skal kunne godkende eller afvise vagtanmodninger baseret på bemanding og forretningsbehov.",
        requestBody: {
          action: "approve",
          comment: "Approved - coverage confirmed"
        },
        responseBody: {
          success: true,
          message: "Shift request approved",
          data: {
            id: 102,
            status: "approved",
            approvedBy: 6,
            approvedAt: "2025-09-05T10:30:00Z"
          }
        }
      },
      {
        method: "PUT",
        path: "/api/hr/shifts/{shiftId}/reject",
        description: "Afvis en vagt eller frihedsanmodning. Giver ledere mulighed for at afvise anmodninger med begrundelse, så medarbejderen forstår hvorfor.",
        requestBody: {
          action: "reject",
          comment: "Cannot approve - insufficient coverage for this date"
        },
        responseBody: {
          success: true,
          message: "Shift request rejected",
          data: {
            id: 103,
            status: "rejected",
            rejectedBy: 6,
            rejectedAt: "2025-09-05T11:15:00Z",
            rejectionReason: "Cannot approve - insufficient coverage for this date"
          }
        }
      },
      {
        method: "DELETE",
        path: "/api/hr/shifts/{shiftId}",
        description: "Slet/annuller en vagtanmodning (kun hvis status er 'requested'). Medarbejdere kan fortryde deres anmodninger før de bliver behandlet af leder.",
        responseBody: {
          success: true,
          message: "Shift request cancelled successfully",
          data: {
            id: 104,
            deletedAt: "2025-09-05T11:20:00Z"
          }
        }
      }
    ]
  },
  {
    title: "HR Module - Week Scheduler",
    description: "Masseoprettelse af vagter og ugentlig skemahåndtering",
    endpoints: [
      {
        method: "POST",
        path: "/api/hr/week-schedule/apply",
        description: "Anvend vagtskabeloner til at oprette faktiske vagter for en uge. Når admin/manager bruger Week Scheduler til at planlægge en uge, skal systemet oprette faktiske vagter baseret på medarbejdernes skabeloner i work_shifts tabellen.",
        requestBody: {
          weekStartDate: "2025-09-08",
          employeeIds: [1, 6, 2],
          applyTemplates: true,
          overwriteExisting: false,
          createdBy: 6
        },
        responseBody: {
          success: true,
          message: "Week schedule applied successfully",
          data: {
            weekStartDate: "2025-09-08",
            shiftsCreated: 15,
            shiftsSkipped: 2,
            details: [
              {
                employeeId: 1,
                employeeName: "Anders Nielsen",
                shiftsCreated: 5,
                shifts: [
                  {
                    id: 201,
                    date: "2025-09-08",
                    startTime: "08:00",
                    endTime: "16:00",
                    locationId: 1
                  }
                ]
              },
              {
                employeeId: 6, 
                employeeName: "Casper Andersen",
                shiftsCreated: 5,
                shifts: [
                  {
                    id: 206,
                    date: "2025-09-08",
                    startTime: "08:00",
                    endTime: "16:00",
                    locationId: 2
                  }
                ]
              }
            ]
          }
        }
      },
      {
        method: "GET",
        path: "/api/hr/week-schedule/preview",
        description: "Forhåndsvisning af hvilke vagter der ville blive oprettet fra skabeloner. Manager skal kunne se en preview af hvad der vil blive oprettet før de faktisk opretter vagterne.",
        queryParams: {
          weekStartDate: "Week start date (YYYY-MM-DD)",
          employeeIds: "Comma-separated employee IDs (optional)"
        },
        responseBody: {
          success: true,
          data: {
            weekStartDate: "2025-09-08",
            preview: [
              {
                employeeId: 1,
                employeeName: "Anders Nielsen",
                shifts: [
                  {
                    date: "2025-09-08",
                    dayOfWeek: 1,
                    startTime: "08:00",
                    endTime: "16:00",
                    locationId: 1,
                    locationName: "Rødovre",
                    fromTemplate: true,
                    wouldOverwrite: false
                  }
                ]
              }
            ]
          }
        }
      },
      {
        method: "DELETE",
        path: "/api/hr/week-schedule/{weekStartDate}",
        description: "Slet alle vagter for en specifik uge. Manager skal kunne slette en hel uges planlægning hvis der er sket fejl eller store ændringer.",
        responseBody: {
          success: true,
          message: "Week schedule deleted successfully",
          data: {
            weekStartDate: "2025-09-08",
            shiftsDeleted: 15,
            affectedEmployees: [1, 2, 6]
          }
        }
      }
    ]
  },
  {
    title: "HR Module - Events",
    description: "Firmabegivenheder, møder og aktiviteter",
    endpoints: [
      {
        method: "GET",
        path: "/api/hr/events",
        description: "Hent begivenheder for datointerval. Viser firmabegivenheder, møder og aktiviteter i kalenderen, så alle kan se hvad der sker.",
        queryParams: {
          startDate: "Start date (YYYY-MM-DD)",
          endDate: "End date (YYYY-MM-DD)",
          eventType: "Filter by event type",
          employeeId: "Filter events for specific employee"
        },
        responseBody: {
          success: true,
          data: [
            {
              id: 1,
              date: "2025-09-10",
              startTime: "10:00",
              endTime: "12:00",
              eventType: "internal_meeting",
              title: "Weekly Team Sync",
              description: "Regular team status meeting",
              locationId: 1,
              locationText: "Meeting Room A",
              color: "#3B82F6",
              attendees: [1, 2, 6],
              createdBy: 6,
              createdAt: "2025-09-01T09:00:00Z"
            }
          ],
          total: 15
        }
      },
      {
        method: "POST",
        path: "/api/hr/events",
        description: "Opret ny begivenhed. HR og ledere skal kunne oprette møder, sociale arrangementer og andre begivenheder.",
        requestBody: {
          date: "2025-09-15",
          startTime: "14:00",
          endTime: "16:00",
          eventType: "customer_visit",
          title: "Client Presentation",
          description: "Product demo for new client",
          locationId: 1,
          locationText: "Showroom",
          attendees: [1, 6]
        },
        responseBody: {
          success: true,
          message: "Event created successfully",
          data: {
            id: 2
          }
        }
      },
      {
        method: "PUT",
        path: "/api/hr/events/{eventId}",
        description: "Opdater en eksisterende begivenhed",
        requestBody: {
          startTime: "15:00",
          endTime: "17:00",
          locationId: 1,
          locationText: "Conference Room B",
          attendees: [1, 6, 3]
        },
        responseBody: {
          success: true,
          message: "Event updated successfully",
          data: {
            id: 2,
            updatedAt: "2025-09-05T11:45:00Z"
          }
        }
      },
      {
        method: "DELETE",
        path: "/api/hr/events/{eventId}",
        description: "Slet/annuller en begivenhed. Begivenheder kan blive aflyst, og det skal registreres så alle deltagere bliver informeret.",
        responseBody: {
          success: true,
          message: "Event cancelled successfully",
          data: {
            id: 2,
            deletedAt: "2025-09-05T11:50:00Z",
            deletedBy: 6
          }
        }
      },
      {
        method: "POST",
        path: "/api/hr/events/{eventId}/attendees",
        description: "Tilføj deltagere til en begivenhed",
        requestBody: {
          attendees: [4, 5]
        },
        responseBody: {
          success: true,
          message: "Attendees added successfully",
          data: {
            eventId: 2,
            newAttendees: [4, 5],
            totalAttendees: 5
          }
        }
      },
      {
        method: "DELETE",
        path: "/api/hr/events/{eventId}/attendees/{employeeId}",
        description: "Fjern en deltager fra en begivenhed",
        responseBody: {
          success: true,
          message: "Attendee removed from event",
          data: {
            eventId: 2,
            removedAttendee: 3,
            remainingAttendees: 4
          }
        }
      }
    ]
  },
  // ============ July 2025 - Original Modules ============
  {
    title: "Customers",
    description: "Endpoints til håndtering af kundedata",
    endpoints: [
      {
        method: "GET",
        path: "/api/customers",
        description: "Hent alle kunder med valgfri filtrering",
        queryParams: {
          type: "Filter by customer type (e.g., 'B2B Promotion Customer')",
          country: "Filter by country (e.g., 'Denmark', 'Sweden')",
          resellerType: "Filter by reseller type (e.g., 'B2B', 'Reseller')",
        },
        responseBody: {
          data: [
            {
              customerId: 1796,
              name: "Busy ApS",
              type: "B2B Promotion Customer",
              resellerType: "B2B",
              industry: "Event Planning",
              country: "Denmark",
              vatZone: "Domestic",
              paymentTerms: "Netto 14 dage",
              contactPerson: "Brian Frisch",
              email: "brian@busy.dk",
              phone: "+45 12345678",
              address: "Strandvejen 100",
              zip: "2100",
              city: "København Ø",
            },
          ],
          total: 150,
          page: 1,
          pageSize: 20,
        },
      },
      {
        method: "GET",
        path: "/api/customers/{customerId}",
        description: "Hent en specifik kunde via ID",
        responseBody: {
          customerId: 1796,
          name: "Busy ApS",
          type: "B2B Promotion Customer",
          resellerType: "B2B",
          industry: "Event Planning",
          country: "Denmark",
          vatZone: "Domestic",
          paymentTerms: "Netto 14 dage",
          contactPerson: "Brian Frisch",
          email: "brian@busy.dk",
          phone: "+45 12345678",
          address: "Strandvejen 100",
          zip: "2100",
          city: "København Ø",
        },
      },
    ],
  },
  {
    title: "Requests",
    description: "Endpoints til salgsanmodninger og muligheder",
    endpoints: [
      {
        method: "GET",
        path: "/api/requests",
        description: "Hent alle anmodninger med filtrering og paginering",
        queryParams: {
          status: "Filter by current status (e.g., 'Pending B2B', 'Order in')",
          assignee: "Filter by assigned sales person (e.g., 'CAS', 'CHR')",
          priority: "Filter by priority ('', '*', '**')",
          startDate: "Filter requests created after this date (ISO 8601)",
          endDate: "Filter requests created before this date (ISO 8601)",
          overdue: "Filter overdue requests (true/false)",
          page: "Page number (default: 1)",
          pageSize: "Items per page (default: 20)",
        },
        responseBody: {
          data: [
            {
              requestId: "REQ3042",
              requestDate: "2025-06-18T00:00:00Z",
              customer: "Busy ApS",
              customerId: 1796,
              contactPerson: "Brian Frisch",
              origin: "Network",
              b2bSales: "CAS",
              priority: "*",
              deadline: "2025-06-20T00:00:00Z",
              startStatus: "Request",
              currentStatus: "Pending B2B",
              endStatus: "Open",
              comment: "10 strandstole med logo - URGENT TODAY",
              orderValue: 15000,
              gmPercent: 35,
            },
          ],
          total: 245,
          page: 1,
          pageSize: 20,
          facets: {
            statuses: [
              { value: "Pending B2B", count: 45 },
              { value: "Order in", count: 32 },
            ],
            assignees: [
              { value: "CAS", count: 28 },
              { value: "CHR", count: 15 },
            ],
          },
        },
      },
      {
        method: "GET",
        path: "/api/requests/{requestId}",
        description: "Hent en specifik anmodning via ID",
        responseBody: {
          requestId: "REQ3042",
          requestDate: "2025-06-18T00:00:00Z",
          customer: "Busy ApS",
          customerId: 1796,
          contactPerson: "Brian Frisch",
          origin: "Network",
          b2bSales: "CAS",
          priority: "*",
          deadline: "2025-06-20T00:00:00Z",
          followUpDate: "2025-06-21T00:00:00Z",
          startStatus: "Request",
          currentStatus: "Pending B2B",
          endStatus: "Open",
          orderReference: "Summer beach promotion",
          orderHeading: "Beach chairs with custom logo",
          comment: "10 strandstole med logo - URGENT TODAY",
          quoteNumber: "Q2025-0342",
          orderValue: 15000,
          gmPercent: 35,
          alternativeDelivery: {
            company: "Beach Resort A/S",
            address: "Strandpromenaden 50",
            zip: "2900",
            city: "Hellerup",
            country: "Denmark",
            att: "Reception",
            phone: "+45 98765432",
          },
        },
      },
      {
        method: "PUT",
        path: "/api/requests/{requestId}/status",
        description: "Opdater anmodningsstatus (til træk og slip funktionalitet)",
        requestBody: {
          newStatus: "Sample",
          oldStatus: "Request",
          updatedBy: "user_id",
          timestamp: "2025-06-27T10:30:00Z"
        },
        responseBody: {
          success: true,
          requestId: "REQ3042",
          previousStatus: "Request",
          newStatus: "Sample",
          updatedAt: "2025-06-27T10:30:00Z",
          updatedBy: "user_id"
        }
      },
    ],
  },
  {
    title: "Orders",
    description: "Endpoints til ordrehåndtering",
    endpoints: [
      {
        method: "GET",
        path: "/api/orders",
        description: "Hent alle ordrer med filtrering",
        queryParams: {
          status: "Filter by order status",
          dateFrom: "Orders placed after this date",
          dateTo: "Orders placed before this date",
          customerId: "Filter by customer ID",
        },
        responseBody: {
          data: [
            {
              requestId: "REQ2998",
              orderNumber: "ORD-2025-0198",
              orderDate: "2025-06-10T00:00:00Z",
              customer: "EventMasters Ltd",
              customerId: 1890,
              currentStatus: "Approved & Activated",
              orderValue: 145600,
              deliveryDate: "2025-06-25T00:00:00Z",
              items: [
                {
                  description: "Branded umbrellas",
                  quantity: 200,
                  unitPrice: 456,
                  total: 91200,
                },
                {
                  description: "Custom banners",
                  quantity: 50,
                  unitPrice: 1088,
                  total: 54400,
                },
              ],
            },
          ],
          total: 89,
          page: 1,
          pageSize: 20,
        },
      },
    ],
  },
  {
    title: "Finance",
    description: "Endpoints til fakturaer og økonomiske data",
    endpoints: [
      {
        method: "GET",
        path: "/api/invoices",
        description: "Hent alle fakturaer med filtrering",
        queryParams: {
          status: "Payment status filter",
          overdue: "Show only overdue invoices (true/false)",
          customerId: "Filter by customer",
          dateFrom: "Invoices created after this date",
          dateTo: "Invoices created before this date",
        },
        responseBody: {
          data: [
            {
              invoiceNumber: "INV-2025-0342",
              invoiceDate: "2025-06-01T00:00:00Z",
              dueDate: "2025-06-15T00:00:00Z",
              customer: "TherkelsenKristiansen ApS",
              customerId: 1682,
              requestId: "REQ2876",
              orderNumber: "ORD-2025-0142",
              amount: 125000,
              vat: 31250,
              totalAmount: 156250,
              currency: "DKK",
              paymentStatus: "Overdue",
              paymentType: "Bank Transaction",
              paymentTerms: "Løbende måned 30 dage",
              items: [
                {
                  description: "Marketing materials package",
                  quantity: 1,
                  unitPrice: 125000,
                  total: 125000,
                },
              ],
            },
          ],
          total: 156,
          page: 1,
          pageSize: 20,
          summary: {
            totalOverdue: 450000,
            totalPending: 1250000,
            totalPaid: 3450000,
          },
        },
      },
    ],
  },
  {
    title: "Reference Data",
    description: "Endpoints til dropdown muligheder og referencedata",
    endpoints: [
      {
        method: "GET",
        path: "/api/reference/assignees",
        description: "Hent alle tilgængelige salgsansvarlige",
        responseBody: {
          assignees: [
            { code: "CAS", name: "Casper Andersen", active: true },
            { code: "CHR", name: "Christina Hansen", active: true },
            { code: "MDJ", name: "Mads D. Jensen", active: true },
            { code: "SEB", name: "Sebastian Berg", active: true },
            { code: "CGJ", name: "Carl Gustav Johansen", active: false },
            { code: "LKR", name: "Lars Kristensen", active: true },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/reference/statuses",
        description: "Hent alle tilgængelige statusser",
        responseBody: {
          requestStatuses: {
            start: ["Request", "Sample", "Offer", "Weborder", "Reorder"],
            current: [
              "Order in",
              "Pending B2B",
              "Pending supplier",
              "Pending customer",
              "Approved & Activated",
              "Shipped",
              "Delivered",
              "Invoiced",
              "Complaint",
              "Cancelled",
              "Pending sample",
              "Pending offer",
            ],
            end: ["Open", "Order", "Cancelled/lost"],
          },
          paymentStatuses: [
            "Pending",
            "Authorized",
            "Paid",
            "PartiallyRefunded",
            "Refunded",
            "Voided",
          ],
        },
      },
      {
        method: "GET",
        path: "/api/reference/origins",
        description: "Hent alle anmodningstyper",
        responseBody: {
          origins: [
            "Unknown",
            "Mail",
            "Phone",
            "Chat",
            "Web Order",
            "Sample Web",
            "Call Me Web",
            "Returning Customer",
            "Network",
            "Other",
            "Referral",
            "Showroom stop by",
          ],
        },
      },
    ],
  },
  {
    title: "System Configuration",
    description: "Systemindstillinger og konfigurationsstyring",
    endpoints: [
      {
        method: "GET",
        path: "/api/config",
        description: "Hent al systemkonfiguration. Frontend skal kende systemindstillinger som valuta, arbejdsuger og standard arbejdstider.",
        responseBody: {
          success: true,
          data: {
            company: {
              name: "B2B Group",
              locations: [
                { id: 1, name: "Rødovre" },
                { id: 2, name: "Ribe" },
                { id: 3, name: "Hjemmefra" }
              ],
              defaultLocationId: 1,
              currency: "DKK",
              locale: "da-DK"
            },
            hr: {
              shiftDefaults: {
                startTime: "08:00",
                endTime: "16:00",
                locationId: 1
              },
              timeSlotSettings: {
                startHour: 6,
                endHour: 22,
                interval: 30
              },
              workWeek: {
                startDay: 1,
                workDays: [1, 2, 3, 4, 5]
              },
              eventTypes: [
                { id: "internal_meeting", label: "Internal Meeting", color: "#3B82F6" },
                { id: "team_session", label: "Team Session", color: "#8B5CF6" },
                { id: "showroom_visitor", label: "Showroom Visit", color: "#10B981" },
                { id: "trade_fair", label: "Trade Fair", color: "#F59E0B" },
                { id: "out_of_office", label: "Out of Office", color: "#6B7280" },
                { id: "customer_visit", label: "Customer Visit", color: "#EC4899" },
                { id: "supplier_meeting", label: "Supplier Meeting", color: "#14B8A6" }
              ]
            },
            sales: {
              statuses: ["Request", "Sample", "Offer", "Order", "Closed"],
              priorityLevels: [
                { id: "normal", label: "Normal", color: "#6B7280" },
                { id: "high", label: "High", color: "#F59E0B", daysThreshold: 0 },
                { id: "critical", label: "Critical", color: "#EF4444", daysThreshold: -7 }
              ]
            },
            orders: {
              statuses: [
                "Order in",
                "Pending B2B",
                "Pending supplier",
                "Pending customer",
                "Approved & Activated",
                "Shipped",
                "Delivered",
                "Invoiced"
              ],
              paymentStatuses: ["Pending", "Paid", "Overdue", "Unknown"]
            },
            finance: {
              paymentTerms: [0, 14, 30, 45, 60],
              invoiceStatuses: [
                "Pending Payment",
                "Payment Received",
                "Overdue",
                "Under Review"
              ]
            }
          }
        }
      },
      {
        method: "GET",
        path: "/api/config/{category}",
        description: "Hent konfiguration for specifik kategori",
        responseBody: {
          success: true,
          data: {
            category: "hr",
            config: {
              shiftDefaults: {
                startTime: "08:00",
                endTime: "16:00",
                locationId: 1
              },
              timeSlotSettings: {
                startHour: 6,
                endHour: 22,
                interval: 30
              }
            }
          }
        }
      },
      {
        method: "PUT",
        path: "/api/config/{category}/{key}",
        description: "Opdater specifik konfigurationsværdi",
        requestBody: {
          value: {
            startTime: "09:00",
            endTime: "17:00",
            location: "Rødovre"
          }
        },
        responseBody: {
          success: true,
          message: "Configuration updated successfully",
          data: {
            category: "hr",
            key: "shiftDefaults",
            value: {
              startTime: "09:00",
              endTime: "17:00",
              locationId: 1
            }
          }
        }
      }
    ]
  },
  {
    title: "System Logging",
    description: "Logging af alle handlinger i systemet for audit og sikkerhed",
    endpoints: [
      {
        method: "POST",
        path: "/api/logs",
        description: "Log en handling til systemlog. Alle API kald skal logges for audit trail, sikkerhed og fejlfinding. Dette endpoint kaldes AUTOMATISK af alle andre endpoints - backend skal implementere dette.",
        why: "Kritisk for compliance (GDPR, revisionsspor), sikkerhedsovervågning, fejlfinding, og performance tracking. Hver handling i systemet skal kunne spores tilbage til bruger, tidspunkt og kontekst.",
        requestBody: {
          // EKSEMPEL 1: Status ændring (fra PUT /api/requests/{id}/status)
          example1_statusChange: {
            actionType: "request_status_changed",
            targetEntity: "request",
            targetId: "REQ3042",
            actionDetails: {
              previousStatus: "Sample",
              newStatus: "Offer",
              changedBy: "drag_drop"
            },
            oldValues: { status: "Sample", updatedAt: "2025-09-01T10:00:00Z" },
            newValues: { status: "Offer", updatedAt: "2025-09-05T14:30:00Z" }
          },
          // EKSEMPEL 2: Failed login (fra POST /api/auth/login)
          example2_failedLogin: {
            actionType: "login_failed",
            targetEntity: "user",
            targetId: null,
            actionDetails: {
              username: "casper",
              reason: "invalid_credentials",
              attemptNumber: 3
            },
            severity: "warning",
            errorMessage: "Invalid username or password"
          },
          // EKSEMPEL 3: Ordre oprettet (fra POST /api/orders)
          example3_orderCreated: {
            actionType: "order_created",
            targetEntity: "order",
            targetId: "ORD-2025-0542",
            actionDetails: {
              customerId: 1796,
              orderValue: 45000,
              itemCount: 3
            },
            newValues: {
              orderNumber: "ORD-2025-0542",
              status: "Order in",
              createdAt: "2025-09-05T14:30:00Z"
            }
          },
          // EKSEMPEL 4: Vagt godkendt (fra POST /api/hr/shifts/{id}/approve)
          example4_shiftApproved: {
            actionType: "shift_approved",
            targetEntity: "shift",
            targetId: 102,
            actionDetails: {
              approvedBy: 6,
              employeeId: 1,
              shiftDate: "2025-09-10"
            },
            oldValues: { status: "requested" },
            newValues: { status: "approved", approvedBy: 6 }
          },
          // EKSEMPEL 5: Bulk opdatering
          example5_bulkUpdate: {
            actionType: "bulk_status_update",
            targetEntity: "request",
            actionDetails: {
              operation: "cancel_old_requests",
              affectedCount: 15,
              reason: "Deadline overskredet"
            }
          }
        },
        responseBody: {
          success: true,
          logId: "log-12345",
          message: "Action logged successfully"
        }
      },
      {
        method: "GET",
        path: "/api/logs",
        description: "Hent system logs (admin: alle logs, bruger: egne logs). Admins skal kunne se alle logs for overvågning. Brugere kan se deres egne handlinger for transparens.",
        queryParams: {
          // EKSEMPEL 1: "Vis alle login fejl i dag"
          example1: "/api/logs?actionType=login_failed&dateFrom=2025-09-05T00:00:00Z",
          // EKSEMPEL 2: "Hvem har ændret REQ3042?"
          example2: "/api/logs?targetEntity=request&targetId=REQ3042",
          // EKSEMPEL 3: "Caspers handlinger i denne uge"
          example3: "/api/logs?userId=6&dateFrom=2025-09-01T00:00:00Z",
          // EKSEMPEL 4: "Alle kritiske fejl"
          example4: "/api/logs?severity=error,critical&limit=100",
          // EKSEMPEL 5: "HR modul aktivitet"
          example5: "/api/logs?category=hr&page=1&limit=50",
          // Standard parametre:
          userId: "Filter by specific user (admin only)",
          actionType: "Filter by action type name",
          category: "Filter by category (auth, data, admin, hr, sales, finance)",
          targetEntity: "Filter by entity type",
          targetId: "Filter by specific entity ID",
          dateFrom: "Start date (ISO 8601)",
          dateTo: "End date (ISO 8601)",
          severity: "Filter by severity (info, warning, error, critical)",
          page: "Page number (default 1)",
          limit: "Results per page (default 50, max 200)"
        },
        responseBody: {
          success: true,
          data: [
            {
              id: 12345,
              actionType: {
                name: "request_status_changed",
                category: "sales",
                description: "Salgsforespørgsel status ændret",
                severity: "info",
                isAdminOnly: false
              },
              user: {
                id: "550e8400-e29b-41d4-a716-446655440000",
                name: "Casper Pedersen",
                email: "casper@b2bgroup.dk"
              },
              employee: {
                id: 8,
                name: "Casper Pedersen",
                department: "Management"
              },
              targetEntity: "request",
              targetId: 1234,
              actionDetails: {
                previousStatus: "Sample",
                newStatus: "Offer",
                changedBy: "drag_drop"
              },
              oldValues: { status: "Sample" },
              newValues: { status: "Offer" },
              ipAddress: "192.168.1.100",
              userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
              requestId: "req-abc123",
              responseStatus: 200,
              errorMessage: null,
              durationMs: 145,
              createdAt: "2025-09-05T14:30:00Z"
            }
          ],
          pagination: {
            page: 1,
            limit: 50,
            total: 1250,
            totalPages: 25
          }
        }
      },
      {
        method: "GET",
        path: "/api/logs/action-types",
        description: "Hent alle mulige handlingstyper. Frontend skal kunne vise filter muligheder og forstå log typer.",
        queryParams: {
          includeAdminOnly: "Include admin-only action types (admin users only, default false)",
          category: "Filter by category (auth, hr, sales, orders, finance, admin)",
          isActive: "Filter only active action types (default true)"
        },
        responseBody: {
          success: true,
          data: [
            // Authentication & User Management
            { id: 1, name: "user_login", category: "auth", description: "Bruger logger ind", severity: "info", isAdminOnly: false },
            { id: 2, name: "user_logout", category: "auth", description: "Bruger logger ud", severity: "info", isAdminOnly: false },
            { id: 3, name: "login_failed", category: "auth", description: "Fejlet login forsøg", severity: "warning", isAdminOnly: false },
            { id: 4, name: "token_refresh", category: "auth", description: "Access token fornyet", severity: "info", isAdminOnly: false },
            { id: 5, name: "password_reset_requested", category: "auth", description: "Password reset anmodet", severity: "info", isAdminOnly: false },
            { id: 6, name: "user_features_updated", category: "auth", description: "Bruger features opdateret", severity: "info", isAdminOnly: true },
            { id: 7, name: "user_settings_updated", category: "auth", description: "Bruger indstillinger ændret", severity: "info", isAdminOnly: false },

            // HR Module - Employees & Locations
            { id: 10, name: "employee_created", category: "hr", description: "Medarbejder oprettet", severity: "info", isAdminOnly: true },
            { id: 11, name: "employee_updated", category: "hr", description: "Medarbejder opdateret", severity: "info", isAdminOnly: true },
            { id: 12, name: "employee_deactivated", category: "hr", description: "Medarbejder deaktiveret", severity: "warning", isAdminOnly: true },
            { id: 13, name: "location_created", category: "hr", description: "Lokation oprettet", severity: "info", isAdminOnly: true },
            { id: 14, name: "location_updated", category: "hr", description: "Lokation opdateret", severity: "info", isAdminOnly: true },
            { id: 15, name: "location_deactivated", category: "hr", description: "Lokation deaktiveret", severity: "warning", isAdminOnly: true },

            // HR Module - Shifts & Scheduling
            { id: 20, name: "shift_requested", category: "hr", description: "Vagt/fri anmodet", severity: "info", isAdminOnly: false },
            { id: 21, name: "shift_approved", category: "hr", description: "Vagt godkendt", severity: "info", isAdminOnly: false },
            { id: 22, name: "shift_rejected", category: "hr", description: "Vagt afvist", severity: "info", isAdminOnly: false },
            { id: 23, name: "shift_cancelled", category: "hr", description: "Vagt annulleret", severity: "info", isAdminOnly: false },
            { id: 24, name: "week_schedule_applied", category: "hr", description: "Ugeplan anvendt", severity: "info", isAdminOnly: true },
            { id: 25, name: "week_schedule_deleted", category: "hr", description: "Ugeplan slettet", severity: "warning", isAdminOnly: true },
            { id: 26, name: "schedule_template_updated", category: "hr", description: "Vagtskabelon opdateret", severity: "info", isAdminOnly: false },

            // HR Module - Events
            { id: 30, name: "event_created", category: "hr", description: "Begivenhed oprettet", severity: "info", isAdminOnly: false },
            { id: 31, name: "event_updated", category: "hr", description: "Begivenhed opdateret", severity: "info", isAdminOnly: false },
            { id: 32, name: "event_cancelled", category: "hr", description: "Begivenhed aflyst", severity: "info", isAdminOnly: false },
            { id: 33, name: "event_attendee_added", category: "hr", description: "Deltager tilføjet", severity: "info", isAdminOnly: false },
            { id: 34, name: "event_attendee_removed", category: "hr", description: "Deltager fjernet", severity: "info", isAdminOnly: false },

            // Sales Module - Requests
            { id: 40, name: "request_created", category: "sales", description: "Salgsforespørgsel oprettet", severity: "info", isAdminOnly: false },
            { id: 41, name: "request_status_changed", category: "sales", description: "Salgsforespørgsel status ændret", severity: "info", isAdminOnly: false },
            { id: 42, name: "request_assigned", category: "sales", description: "Forespørgsel tildelt sælger", severity: "info", isAdminOnly: false },
            { id: 43, name: "request_priority_changed", category: "sales", description: "Prioritet ændret", severity: "info", isAdminOnly: false },
            { id: 44, name: "request_deadline_changed", category: "sales", description: "Deadline ændret", severity: "info", isAdminOnly: false },
            { id: 45, name: "request_deleted", category: "sales", description: "Forespørgsel slettet", severity: "warning", isAdminOnly: true },

            // Orders Module
            { id: 50, name: "order_created", category: "orders", description: "Ordre oprettet", severity: "info", isAdminOnly: false },
            { id: 51, name: "order_status_changed", category: "orders", description: "Ordre status ændret", severity: "info", isAdminOnly: false },
            { id: 52, name: "order_approved", category: "orders", description: "Ordre godkendt", severity: "info", isAdminOnly: false },
            { id: 53, name: "order_shipped", category: "orders", description: "Ordre afsendt", severity: "info", isAdminOnly: false },
            { id: 54, name: "order_delivered", category: "orders", description: "Ordre leveret", severity: "info", isAdminOnly: false },
            { id: 55, name: "order_cancelled", category: "orders", description: "Ordre annulleret", severity: "warning", isAdminOnly: false },
            { id: 56, name: "order_complaint", category: "orders", description: "Ordre reklamation", severity: "warning", isAdminOnly: false },

            // Finance Module
            { id: 60, name: "invoice_created", category: "finance", description: "Faktura oprettet", severity: "info", isAdminOnly: false },
            { id: 61, name: "payment_received", category: "finance", description: "Betaling modtaget", severity: "info", isAdminOnly: false },
            { id: 62, name: "payment_overdue", category: "finance", description: "Betaling forfalden", severity: "warning", isAdminOnly: false },
            { id: 63, name: "refund_issued", category: "finance", description: "Refundering udstedt", severity: "info", isAdminOnly: true },
            { id: 64, name: "credit_note_created", category: "finance", description: "Kreditnota oprettet", severity: "info", isAdminOnly: true },

            // System & Admin
            { id: 70, name: "config_updated", category: "admin", description: "System konfiguration ændret", severity: "warning", isAdminOnly: true },
            { id: 71, name: "bulk_import", category: "admin", description: "Bulk data import", severity: "info", isAdminOnly: true },
            { id: 72, name: "bulk_export", category: "admin", description: "Bulk data eksport", severity: "info", isAdminOnly: true },
            { id: 73, name: "bulk_update", category: "admin", description: "Bulk opdatering", severity: "info", isAdminOnly: true },
            { id: 74, name: "maintenance_mode_enabled", category: "admin", description: "Vedligeholdelse aktiveret", severity: "critical", isAdminOnly: true },
            { id: 75, name: "backup_created", category: "admin", description: "Backup oprettet", severity: "info", isAdminOnly: true },
            { id: 76, name: "system_error", category: "admin", description: "System fejl", severity: "error", isAdminOnly: true },

            // Data Access & Views
            { id: 80, name: "data_view", category: "data", description: "Data vist", severity: "info", isAdminOnly: false },
            { id: 81, name: "data_search", category: "data", description: "Data søgning", severity: "info", isAdminOnly: false },
            { id: 82, name: "data_export", category: "data", description: "Data eksporteret", severity: "info", isAdminOnly: false },
            { id: 83, name: "report_generated", category: "data", description: "Rapport genereret", severity: "info", isAdminOnly: false }
          ]
        }
      },
      {
        method: "GET",
        path: "/api/logs/stats",
        description: "Hent statistik over system logs. Vise dashboard med log aktivitet, mest brugte funktioner, og fejl trends.",
        queryParams: {
          period: "Time period (today, week, month, year)",
          groupBy: "Group by field (actionType, category, user, severity)"
        },
        responseBody: {
          success: true,
          data: {
            period: "week",
            totalActions: 5234,
            uniqueUsers: 8,
            topActions: [
              { name: "data_view", count: 2145, percentage: 41 },
              { name: "data_search", count: 892, percentage: 17 },
              { name: "request_status_changed", count: 234, percentage: 4.5 }
            ],
            severityBreakdown: {
              info: 4890,
              warning: 312,
              error: 32,
              critical: 0
            },
            errorRate: 0.6,
            averageResponseTime: 234 // milliseconds
          }
        }
      }
    ]
  },
];

export default function EndpointsSection() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedEndpoints, setExpandedEndpoints] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoints((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Split sections into July and September groups
  // July sections are at the end (after comment "July 2025 - Original Modules")
  const julySections = endpointSections.filter(s => 
    ["Customers", "Requests", "Orders", "Finance", "Reference Data"].includes(s.title)
  );
  // September sections are everything else
  const septemberSections = endpointSections.filter(s => 
    !["Customers", "Requests", "Orders", "Finance", "Reference Data"].includes(s.title)
  );

  const renderSections = (sections: EndpointSection[]) => {
    return sections.map((section) => {
      const isExpanded = expandedSections.includes(section.title);
      
      return (
        <div
          key={section.title}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <button
              onClick={() => toggleSection(section.title)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {section.description}
                </p>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  <span className="inline-flex items-center gap-1">
                    {isExpanded ? (
                      <ChevronDownIcon className="w-3 h-3" />
                    ) : (
                      <ChevronRightIcon className="w-3 h-3" />
                    )}
                    {section.endpoints.length} endpoints • Klik for at {isExpanded ? 'skjule' : 'se'} detaljer
                  </span>
                </p>
              </div>
              {isExpanded ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-gray-200">
                {section.endpoints.map((endpoint, index) => {
                  const endpointKey = `${section.title}-${index}`;
                  const isEndpointExpanded =
                    expandedEndpoints.includes(endpointKey);

                  return (
                    <div
                      key={endpointKey}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <button
                        onClick={() => toggleEndpoint(endpointKey)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${
                                endpoint.method === "GET"
                                  ? "bg-gray-100 text-gray-700"
                                  : endpoint.method === "POST"
                                  ? "bg-gray-100 text-gray-700"
                                  : endpoint.method === "PUT"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-700">
                              {endpoint.path}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {isEndpointExpanded ? 'Skjul detaljer' : 'Vis detaljer'}
                            </span>
                            {isEndpointExpanded ? (
                              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="ml-16 mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            {endpoint.description}
                          </p>
                        </div>
                      </button>

                      {isEndpointExpanded && (
                        <div className="px-6 pb-4 space-y-4">
                          {endpoint.queryParams && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">
                                Query Parameters
                              </h5>
                              <div className="bg-gray-50 rounded p-3 text-sm">
                                {Object.entries(endpoint.queryParams).map(
                                  ([key, value]) => (
                                    <div key={key} className="mb-1">
                                      <code className="text-purple-600">
                                        {key}
                                      </code>
                                      <span className="text-gray-600">
                                        : {value}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {endpoint.requestBody !== undefined && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">
                                Request Body
                              </h5>
                              <pre className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto text-sm">
                                {JSON.stringify(endpoint.requestBody, null, 2)}
                              </pre>
                            </div>
                          )}

                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">
                              Response Example
                            </h5>
                            <pre className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto text-sm">
                              {JSON.stringify(endpoint.responseBody, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">API Endpoints</h2>

      {/* September 2025 - New Modules */}
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">September 2025 - Nye Funktioner</h3>
          <p className="text-sm text-gray-600 mb-4">
            Nye API endpoints tilføjet i september 2025 for Authentication, HR modulet og System Configuration.
          </p>
        </div>
        <div className="space-y-4 ml-2">
          {renderSections(septemberSections)}
        </div>
      </div>

      {/* July 2025 - Original Modules */}
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Juli 2025 - Original Funktioner</h3>
          <p className="text-sm text-gray-600 mb-4">
            Original API endpoints for CRM dashboard - kunde håndtering, salg, ordrer og økonomi.
          </p>
        </div>
        <div className="space-y-4 ml-2">
          {renderSections(julySections)}
        </div>
      </div>
    </div>
  );
}