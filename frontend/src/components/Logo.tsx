type LogoProps = { className?: string }

const ValleyMark = () => (
  <>
    <path
      d="M4 46 C10 30 16 16 24 16 C31 16 34 28 40 36 C46 28 49 16 56 16 C64 16 70 30 76 46 Z"
      className="fill-chocolate"
    />
    <path
      d="M28 30 C33 30 36 38 40 44 C44 38 47 30 52 30"
      fill="none"
      className="stroke-caramel"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </>
)

export const HeaderLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 232 50" role="img" aria-label="Pastisseria La Vall" className={className}>
    <g transform="scale(.62) translate(0,16)">
      <ValleyMark />
    </g>
    <text x="58" y="29" className="fill-chocolate font-display" fontSize="32" fontWeight="600">
      La Vall
    </text>
    <text x="59" y="44" className="fill-caramel font-sans" fontSize="7.5" letterSpacing="2.4">
      PASTISSERIA · BARCELONA
    </text>
  </svg>
)

export const SealLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 230 230" role="img" aria-label="Pastisseria La Vall" className={className}>
    <defs>
      <path id="seal-top" d="M30 115 a85 85 0 0 1 170 0" />
      <path id="seal-bottom" d="M38 115 a77 77 0 0 0 154 0" />
    </defs>
    <circle cx="115" cy="115" r="110" fill="none" className="stroke-chocolate" strokeWidth="2" />
    <circle cx="115" cy="115" r="100" fill="none" className="stroke-caramel" strokeWidth="1" />
    <text className="fill-chocolate font-sans" fontSize="12" fontWeight="600" letterSpacing="5">
      <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
        PASTISSERIA ARTESANA
      </textPath>
    </text>
    <text
      className="fill-chocolate font-sans"
      fontSize="12"
      fontWeight="600"
      letterSpacing="5"
      dy="10"
    >
      <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
        BARCELONA
      </textPath>
    </text>
    <text
      x="115"
      y="123"
      textAnchor="middle"
      className="fill-chocolate font-display"
      fontSize="52"
      fontWeight="600"
    >
      La Vall
    </text>
    <text
      x="115"
      y="146"
      textAnchor="middle"
      className="fill-caramel font-sans"
      fontSize="10"
      letterSpacing="3"
    >
      · EST. 2026 ·
    </text>
  </svg>
)
