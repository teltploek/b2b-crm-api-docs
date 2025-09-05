export default function IntroSection() {
  return (
    <section className="mb-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduktion</h2>
        
        <div className="space-y-4 text-gray-700">          
          <p>
            Denne side er indledningsvis tænkt som et kommunikationsværktøj og et fælles udgangspunkt 
            for en dialog omkring API-endpoints og payloads til det nye B2B CRM Dashboard og HR system.
          </p>
          
          <p>
            Formålet er at skabe en <em>fælles forståelse</em> af hvilke data vi har brug for, 
            ikke at diktere hvordan I skal implementere det. Database dokumentationen inkluderer nu også et <em>visuelt diagram</em> over 
            hele databasestrukturen med relationer mellem tabeller, som gør det nemt at få overblik over systemets arkitektur.
            I kan finde de forskellige informationer ved at navigere mellem fanerne ovenfor.
          </p>

          
          <div className="bg-gray-50 border border-gray-200 rounded p-4 my-4">
            <h4 className="font-semibold text-gray-800 mb-3">September 2025 - Nye Funktioner & Udvidelser</h4>
            <div className="text-gray-700 text-sm space-y-2">
              <p><strong>Nye funktioner tilføjet:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Authentication</strong> - Integration med eksisterende AspNetUsers, dashboard features og settings</li>
                <li><strong>HR Module - Locations</strong> - Kontorlokationer og arbejdssteder (med fuld CRUD)</li>
                <li><strong>HR Module - Employees</strong> - Medarbejder administration og information</li>
                <li><strong>HR Module - Schedule Templates</strong> - Ugentlige skabeloner for medarbejdere</li>
                <li><strong>HR Module - Work Shifts</strong> - Vagtplaner, tidsregistrering og fritagelsesanmodninger (inkl. godkendelse/afvisning)</li>
                <li><strong>HR Module - Events</strong> - Firmabegivenheder, møder og aktiviteter (med CRUD operationer)</li>
                <li><strong>System Configuration</strong> - Central konfiguration for hele systemet</li>
                <li><strong>System Logging</strong> - Komplet audit trail og aktivitetslog for alle handlinger</li>
              </ul>
              <p className="mt-2">
                <strong>Database Schema:</strong> Komplet database dokumentation er nu tilgængelig som en dedikeret side 
                under <strong>&quot;Database Schema&quot;</strong> fanen. Inkluderer nye tabeller med SQL scripts.
              </p>
              <p>
                <strong>API Endpoints:</strong> 55+ fuldt dokumenterede endpoints med request/response eksempler
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Integration med Master System</h4>
            <p className="text-yellow-700 text-sm">
              Systemet bygger videre på brugerne i <code className="bg-yellow-100 px-1 rounded">AspNetUsers</code>. 
              Dashboard-systemet udvider eksisterende brugere med dashboard-specifikke features og indstillinger, 
              uden at påvirke master systemets data.
            </p>
          </div>
          
          <p>
            API dokumentationen er organiseret i to hovedsektioner:
          </p>
          
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>API Endpoints</strong> - Alle endpoints med request/response eksempler</li>
            <li><strong>Database Schema</strong> - Nye tabeller der tilføjes med SQL scripts</li>
          </ul>
        </div>
      </div>
    </section>
  );
}