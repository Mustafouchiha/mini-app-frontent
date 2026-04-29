// ReQurilish R-Logo — aylana, to'ldirilgan, texnik chizma uslubida
export default function Logo({ size = 48 }) {
  const border = Math.max(2, Math.round(size * 0.04));
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "100%",
      overflow: "hidden",
      background: "#FFFFFF",
      border: `${border}px solid #1C1C1C`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
    }}>
      <svg
        width="84%"
        height="84%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chap: ikkita vertikal parallelogramm */}
        <rect x="5" y="29" width="11" height="54" fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" rx="1"/>
        <rect x="19" y="21" width="11" height="62" fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" rx="1"/>

        {/* Diagonal hatching — birinchi to'rtburchak */}
        <clipPath id="h1"><rect x="5" y="29" width="11" height="54"/></clipPath>
        <g clipPath="url(#h1)" stroke="#1C1C1C" strokeWidth="1" opacity="0.3">
          {[-6,0,6,12,18,24,30,36,42,48,54].map((d,i)=>(
            <line key={i} x1={5+d} y1="29" x2={5+d-18} y2="83"/>
          ))}
        </g>

        {/* Diagonal hatching — ikkinchi to'rtburchak */}
        <clipPath id="h2"><rect x="19" y="21" width="11" height="62"/></clipPath>
        <g clipPath="url(#h2)" stroke="#1C1C1C" strokeWidth="1" opacity="0.3">
          {[-6,0,6,12,18,24,30,36,42,48,54,60].map((d,i)=>(
            <line key={i} x1={19+d} y1="21" x2={19+d-18} y2="83"/>
          ))}
        </g>

        {/* Yuqori o'q (R ning ustki qismi) */}
        <polygon
          points="34,12 72,12 84,24 72,24 72,20 38,20 38,44 52,44 52,50 32,50 32,20 34,20"
          fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"
        />
        {/* Yuqori o'q boshi */}
        <polygon
          points="72,12 88,28 82,28 82,24"
          fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"
        />

        {/* O'ng pastki o'q */}
        <polygon
          points="52,50 86,50 86,74 80,74 80,56 52,56"
          fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"
        />
        {/* O'ng pastki o'q boshi */}
        <polygon
          points="86,74 70,90 70,84 80,74"
          fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"
        />

        {/* Pastki chapga o'q */}
        <polygon
          points="32,50 38,50 38,82 60,82 60,88 32,88"
          fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"
        />
        {/* Pastki chapga o'q boshi */}
        <polygon
          points="32,88 16,72 22,72 32,82"
          fill="#F4610A" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
