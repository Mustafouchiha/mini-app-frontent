// ReQurilish R-Logo — texnik chizma uslubida
export default function Logo({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chap — diagonal chiziqli to'rtburchaklar */}
      <rect x="6" y="30" width="10" height="52" fill="#F4894A" opacity="0.15" stroke="#F4894A" strokeWidth="1"/>
      <rect x="20" y="22" width="10" height="60" fill="#F4894A" opacity="0.15" stroke="#F4894A" strokeWidth="1"/>

      {/* Diagonal hatching — birinchi to'rtburchak */}
      <clipPath id="cl1"><rect x="6" y="30" width="10" height="52"/></clipPath>
      <g clipPath="url(#cl1)" stroke="#F4894A" strokeWidth="0.8" opacity="0.9">
        {[-10,-5,0,5,10,15,20,25,30,35,40,45,50,55,60].map((d,i)=>(
          <line key={i} x1={6+d} y1="30" x2={6+d-20} y2="82"/>
        ))}
      </g>

      {/* Diagonal hatching — ikkinchi to'rtburchak */}
      <clipPath id="cl2"><rect x="20" y="22" width="10" height="60"/></clipPath>
      <g clipPath="url(#cl2)" stroke="#F4894A" strokeWidth="0.8" opacity="0.9">
        {[-10,-5,0,5,10,15,20,25,30,35,40,45,50,55,60,65].map((d,i)=>(
          <line key={i} x1={20+d} y1="22" x2={20+d-20} y2="82"/>
        ))}
      </g>

      {/* O'ng — R shaklidagi aylana o'q (3 ta o'q) */}
      {/* Yuqori o'q */}
      <polygon
        points="38,12 72,12 82,22 72,22 72,18 42,18 42,42 52,42 52,48 36,48 36,18 38,18"
        fill="none" stroke="#F4894A" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* O'ng yuqori — o'q boshi */}
      <polygon
        points="72,12 88,28 82,28 82,22"
        fill="#F4894A" opacity="0.3" stroke="#F4894A" strokeWidth="1.2"
      />

      {/* O'ng pastki o'q */}
      <polygon
        points="52,48 84,48 84,72 78,72 78,54 52,54"
        fill="none" stroke="#F4894A" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* O'ng pastki — o'q boshi */}
      <polygon
        points="84,72 68,88 68,82 78,72"
        fill="#F4894A" opacity="0.3" stroke="#F4894A" strokeWidth="1.2"
      />

      {/* Pastki chapga o'q */}
      <polygon
        points="36,48 42,48 42,82 62,82 62,88 36,88"
        fill="none" stroke="#F4894A" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* Pastki chapga — o'q boshi */}
      <polygon
        points="36,88 20,72 26,72 36,82"
        fill="#F4894A" opacity="0.3" stroke="#F4894A" strokeWidth="1.2"
      />
    </svg>
  );
}
