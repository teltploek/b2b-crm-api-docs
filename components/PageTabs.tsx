"use client";

import { useState } from "react";
import IntroSection from "./IntroSection";
import EndpointsSection from "./EndpointsSection";
import DatabaseSection from "./DatabaseSection";

export default function PageTabs() {
  const [activeTab, setActiveTab] = useState<"intro" | "api" | "database">("intro");

  return (
    <>
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("intro")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "intro"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            Introduktion
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "api"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            API Endpoints
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === "database"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            Database Schema
          </button>
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === "intro" && <IntroSection />}
        {activeTab === "api" && <EndpointsSection />}
        {activeTab === "database" && <DatabaseSection />}
      </div>
    </>
  );
}