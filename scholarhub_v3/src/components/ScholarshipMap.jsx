import { useState, useMemo } from "react";
import { daysUntil, deadlineLabel, deadlineClass } from "../utils/helpers.js";

const INDIA_STATES = [
  { id: "Maharashtra", name: "Maharashtra", path: "M 340 380 L 380 360 L 410 390 L 420 430 L 390 450 L 360 440 L 330 410 Z", cx: 375, cy: 410 },
  { id: "Delhi",       name: "Delhi",       path: "M 370 210 L 385 205 L 390 220 L 375 228 Z", cx: 380, cy: 216 },
  { id: "Karnataka",   name: "Karnataka",   path: "M 340 470 L 380 455 L 410 480 L 400 520 L 360 530 L 330 505 Z", cx: 370, cy: 495 },
  { id: "Tamil Nadu",  name: "Tamil Nadu",  path: "M 360 530 L 395 515 L 410 555 L 390 600 L 360 595 L 345 565 Z", cx: 378, cy: 560 },
  { id: "Gujarat",     name: "Gujarat",     path: "M 270 310 L 320 295 L 345 335 L 330 370 L 285 375 L 258 345 Z", cx: 305, cy: 338 },
  { id: "Rajasthan",   name: "Rajasthan",   path: "M 285 225 L 360 205 L 375 265 L 355 310 L 290 320 L 258 278 Z", cx: 325, cy: 268 },
  { id: "Uttar Pradesh",name:"Uttar Pradesh","path":"M 385 215 L 455 210 L 480 245 L 455 280 L 385 285 L 370 255 Z", cx: 428, cy: 250 },
  { id: "West Bengal", name: "West Bengal", path: "M 490 270 L 520 260 L 535 290 L 525 325 L 495 330 L 480 300 Z", cx: 510, cy: 298 },
  { id: "Telangana",   name: "Telangana",   path: "M 385 420 L 420 408 L 440 435 L 430 465 L 395 470 L 375 448 Z", cx: 410, cy: 442 },
  { id: "Andhra Pradesh",name:"Andhra Pradesh","path":"M 390 465 L 430 455 L 460 490 L 445 530 L 405 535 L 382 505 Z", cx: 422, cy: 498 },
  { id: "Kerala",      name: "Kerala",      path: "M 340 530 L 360 520 L 368 565 L 355 600 L 335 595 L 328 565 Z", cx: 348, cy: 562 },
  { id: "Madhya Pradesh",name:"Madhya Pradesh","path":"M 340 295 L 410 280 L 440 320 L 425 360 L 360 365 L 325 335 Z", cx: 385, cy: 323 },
  { id: "Punjab",      name: "Punjab",      path: "M 330 175 L 370 168 L 378 195 L 355 205 L 322 198 Z", cx: 352, cy: 188 },
  { id: "Haryana",     name: "Haryana",     path: "M 355 195 L 385 188 L 392 215 L 370 220 L 348 212 Z", cx: 370, cy: 205 },
  { id: "Bihar",       name: "Bihar",       path: "M 455 255 L 495 248 L 505 278 L 488 300 L 452 295 L 442 272 Z", cx: 475, cy: 276 },
  { id: "Odisha",      name: "Odisha",      path: "M 465 320 L 505 310 L 520 345 L 505 375 L 468 378 L 450 350 Z", cx: 488, cy: 348 },
  { id: "Assam",       name: "Assam",       path: "M 560 225 L 600 218 L 612 242 L 595 262 L 558 258 Z", cx: 585, cy: 242 },
  { id: "Jharkhand",   name: "Jharkhand",   path: "M 470 295 L 505 285 L 518 315 L 503 340 L 468 342 L 455 318 Z", cx: 488, cy: 315 },
  { id: "Chhattisgarh",name:"Chhattisgarh","path":"M 430 325 L 470 315 L 480 358 L 462 390 L 428 388 L 415 358 Z", cx: 450, cy: 357 },
  { id: "Uttarakhand", name: "Uttarakhand", path: "M 385 185 L 418 178 L 430 205 L 415 218 L 382 215 Z", cx: 405, cy: 198 },
];

const getColor = (count) => {
  if (count > 15) return "var(--primary)";
  if (count > 8)  return "var(--primary-light)";
  if (count > 3)  return "#dbeafe";
  return "#f8fafc";
};

export default function ScholarshipMap({ scholarships, saved, onViewScholar }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const stateCounts = useMemo(() => {
    const map = {};
    INDIA_STATES.forEach(s => {
      map[s.id] = scholarships.filter(sc => sc.states.includes("all") || sc.states.includes(s.id)).length;
    });
    return map;
  }, [scholarships]);

  const stateScholarships = useMemo(() => {
    if (!selectedState) return [];
    return scholarships.filter(s => s.states.includes("all") || s.states.includes(selectedState))
      .sort((a, b) => b.amount_value - a.amount_value);
  }, [selectedState, scholarships]);

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#dbeafe", color: "var(--primary)", width: 36, height: 36 }}>🗺️</div>
            Scholarship Map
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Explore scholarships by state and find regional opportunities.</p>
        </div>
      </div>

      <div className="grid-2 gap-8" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div className="dash-card" style={{ padding: 32, position: "relative" }}>
          <svg viewBox="200 150 450 500" style={{ width: "100%", height: "auto", cursor: "pointer" }}>
            {INDIA_STATES.map(state => {
              const count = stateCounts[state.id] || 0;
              const isSelected = selectedState === state.id;
              const isHovered  = hoveredState === state.id;
              return (
                <path key={state.id}
                  d={state.path}
                  fill={isSelected ? "var(--primary)" : isHovered ? "var(--primary-light)" : getColor(count)}
                  stroke="#fff" strokeWidth={isSelected ? 3 : 1}
                  style={{ transition: "all 0.2s" }}
                  onClick={() => setSelectedState(state.id)}
                  onMouseEnter={() => setHoveredState(state.id)}
                  onMouseLeave={() => setHoveredState(null)}
                />
              );
            })}
          </svg>
        </div>

        <div className="dash-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--navy)", marginBottom: 16 }}>
            {selectedState ? `${selectedState}` : "Select a State"}
          </h3>
          {!selectedState ? (
            <div style={{ textAlign: "center", padding: 40, opacity: 0.5 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>Click on the map</p>
            </div>
          ) : (
            <div className="flex flex-column gap-3" style={{ maxHeight: 500, overflowY: "auto" }}>
              {stateScholarships.map(s => (
                <div key={s.id} className="premium-card" style={{ padding: 16, cursor: "pointer" }} onClick={() => onViewScholar(s)}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "var(--navy)" }}>{s.name}</div>
                  <div className="flex items-center justify-between mt-3">
                    <span style={{ fontWeight: 800, fontSize: 12, color: "#10b981" }}>{s.amount}</span>
                    <span className="badge badge-gray" style={{ fontSize: 9 }}>{s.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
