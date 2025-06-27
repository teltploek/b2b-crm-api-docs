export default function IntroSection() {
  return (
    <section className="mb-12 bg-blue-50 rounded-lg p-8 border border-blue-200">
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduktion</h2>
        
        <div className="space-y-4 text-gray-700">          
          <p>
            Denne side er indledningsvis tænkt som et kommunikationsværktøj og et fælles udgangspunkt 
            for en dialog omkring API-endpoints og payloads til det nye B2B CRM Dashboard.
          </p>
          
          <p>
            <strong>Vigtigt at bemærke:</strong>
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Dette er <em>kun et forslag</em> baseret på den mockdata jeg har arbejdet med i frontend. Jeg har ikke haft adgang til jeres backend eller eksisterende API&aop;er, så jeg har gættet lidt.
            </li>
            <li>
              Alle endpoints og datastrukturer er <em>åbne for ændringer</em> og tilpasninger, og vi skal formentlig tilpasse dem i takt med, at jeg bliver klogere på jeres systemer og behov.
            </li>
            <li>
              Jeg ved at mange af disse data allerede eksisterer i jeres systemer - lad os sammen 
              finde den bedste måde at eksponere dem på.
            </li>
            <li>
              Formålet er at skabe en <em>fælles forståelse</em> af hvilke data vi har brug for, 
              ikke at diktere hvordan I skal implementere det.
            </li>
          </ul>
          
          <div className="bg-green-50 border border-green-200 rounded p-4 my-4">
            <h4 className="font-semibold text-green-800 mb-2">🆕 Nyt: Drag & Drop Funktionalitet</h4>
            <p className="text-green-700 text-sm">
              Frontend drag-and-drop systemet er nu implementeret og klar! Se især 
              <code className="bg-green-100 px-1 rounded">PUT /api/requests/{'{requestId}'}/status</code> 
              endpointet under &quot;Requests&quot; sektionen for at muliggøre status opdateringer via drag-and-drop i dashboardet.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4 my-4">
            <h4 className="font-semibold text-blue-800 mb-2">🆕 Nyt: Kundetype Filter</h4>
            <p className="text-blue-700 text-sm">
              Der er nu implementeret et globalt kundetype filter i navigationen, som gør det muligt at filtrere 
              mellem &quot;B2B Promotion Customer&quot; og &quot;B2B Sport Customer&quot;. Filtreringen sker på frontend-siden, 
              så der er ingen ændringer påkrævet i API&apos;et - kundedata skal blot inkludere kundetype information.
            </p>
          </div>
          
          <p>
            Nedenfor finder I forslag til endpoints organiseret efter funktionsområde. 
            Hver sektion indeholder:
          </p>
          
          <ul className="list-disc pl-6 space-y-1">
            <li>Forslag til endpoint URL</li>
            <li>Eksempel på request (hvor relevant)</li>
            <li>Eksempel på response baseret på nuværende mockdata</li>
            <li><strong>Nye endpoints for interaktive funktioner</strong> (som drag & drop)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}