"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface EndpointExample {
  method: string;
  path: string;
  description: string;
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
  {
    title: "Customers",
    description: "Endpoints for managing customer data",
    endpoints: [
      {
        method: "GET",
        path: "/api/customers",
        description: "Get all customers with optional filtering",
        queryParams: {
          type: "Filter by customer type (e.g., 'B2B Promotion Customer')",
          country: "Filter by country (e.g., 'Denmark', 'Sweden')",
          resellerType: "Filter by reseller type (e.g., 'B2B', 'Reseller')",
        },
        responseBody: {
          data: [
            {
              customerId: "1796",
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
        description: "Get a specific customer by ID",
        responseBody: {
          customerId: "1796",
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
    description: "Endpoints for sales requests and opportunities",
    endpoints: [
      {
        method: "GET",
        path: "/api/requests",
        description: "Get all requests with filtering and pagination",
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
              customerId: "1796",
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
        description: "Get a specific request by ID",
        responseBody: {
          requestId: "REQ3042",
          requestDate: "2025-06-18T00:00:00Z",
          customer: "Busy ApS",
          customerId: "1796",
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
        description: "Update request status (for drag and drop functionality)",
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
    description: "Endpoints for order management",
    endpoints: [
      {
        method: "GET",
        path: "/api/orders",
        description: "Get all orders with filtering",
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
              customerId: "1890",
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
    description: "Endpoints for invoices and financial data",
    endpoints: [
      {
        method: "GET",
        path: "/api/invoices",
        description: "Get all invoices with filtering",
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
              customerId: "1682",
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
    description: "Endpoints for dropdown options and reference data",
    endpoints: [
      {
        method: "GET",
        path: "/api/reference/assignees",
        description: "Get all available sales assignees",
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
        description: "Get all available statuses",
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
        description: "Get all request origin types",
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">API Endpoints</h2>

      {endpointSections.map((section) => {
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {section.description}
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
                                  ? "bg-blue-100 text-blue-700"
                                  : endpoint.method === "POST"
                                  ? "bg-green-100 text-green-700"
                                  : endpoint.method === "PUT"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-700">
                              {endpoint.path}
                            </code>
                          </div>
                          {isEndpointExpanded ? (
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 ml-16">
                          {endpoint.description}
                        </p>
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
      })}
    </div>
  );
}