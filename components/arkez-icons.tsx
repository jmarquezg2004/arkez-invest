import type { SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };
// The functional glyphs share a 24-unit frame. Signals can take a secondary brand colour.
const concepts = {
  education: ["M3 5.5C6 4.7 9 5 12 7c3-2 6-2.3 9-1.5v12c-3-.8-6-.5-9 1.5-3-2-6-2.3-9-1.5zM12 7v12M6 9l3 .7m-3 3 3 .7", "m15 10 3-.8m-3 4 3-.8"],
  market: ["M3 4v16h18M7 16v-4m5 4V9m5 7v-5", "m6 10 4-4 4 2 5-4m-3 0h3v3"],
  allocation: ["M3 4h18v5H3zM3 10h18v5H3zM3 16h18v4H3z", "M13 4v5M9 10v5m8 1v4"],
  advice: ["M4 5h15v14H4zM19 9h2v12H8v-2M7 9h9m-9 4h4", "m12 15 1.8 1.8L17 13"],
  people: ["M4 20v-2a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v2M7 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0z", "M17 5a3 3 0 0 1 0 6m2 4a3 3 0 0 1 2 3v2"],
  business: ["M3 20h18M5 20V7l8-3v16m0-11 6 2v9M8 10h2m-2 4h2m6-1h1m-1 3h1", "M9 17v3"],
  document: ["M5 3h9l5 5v13H5V3Zm9 0v5h5M8 12h8", "M8 16h5"],
  dialogue: ["M4 5h16v11h-8l-5 4v-4H4zM8 9h8", "M8 12h5"],
  risk: ["M12 3c2.6 2 5.1 3 8 3.5v6c0 3.5-4 6.8-8 8.5-4-1.7-8-5-8-8.5v-6C6.9 6 9.4 5 12 3Z", "M7 13h3l1.5-4 2 6 1-2H17"],
  technology: ["M7 6h10v12H7zM3 9h4m-4 6h4m10-6h4m-4 6h4M10 3v3m4-3v3m-4 12v3m4-3v3", "M10 10h4v4h-4z"],
  insight: ["M13 3H5v18h10m-7-5h4m-4-4h2m5-6 5 2.5v5l-5 2.5-5-2.5v-5z", "m15 9 1.7 2.5L15 14m2.6-2.5H20"],
  chain: ["M3 7 7 5l4 2v5l-4 2-4-2zm10 5 4-2 4 2v5l-4 2-4-2zM7 9v5m10 0v5", "m11 10 2 1m-2 3 2 1M3 7l4 2 4-2m2 5 4 2 4-2"],
  token: ["M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5m-8 4.5v9", "m8 14.3 1.5 1.1m4.8-.6 2.2-1.3"],
  scenario: ["M4 5h16v14H4zM4 10h16m-10 0v9", "M13 15h4m-2-2v4M6 14h2"],
  library: ["M4 4h4v15H4zM10 4h4v15h-4zm6 1 3-.6 3 14-3 .6z", "M3 21h19"],
} as const;

const shapes = {
  arrow: "M4 12h15m-5-5 5 5-5 5",
  arrowDown: "M12 4v15m-5-5 5 5 5-5",
  arrowOut: "M6 18 18 6M9 6h9v9",
  chevron: "m7 10 5 5 5-5",
  chevronRight: "m10 7 5 5-5 5",
  menu: "M3 7h18M3 12h14m-14 5h18",
  close: "m6 6 12 12M18 6 6 18",
} as const;

function mark(name: keyof typeof shapes | keyof typeof concepts) {
  return function ArkezMark({ size = 24, strokeWidth = 1.55, ...props }: IconProps) {
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true" data-mark={name} {...props}>
      {name in concepts ? <>
        <path d={concepts[name as keyof typeof concepts][0]} />
        <path className="arkez-mark-signal" d={concepts[name as keyof typeof concepts][1]} />
      </> : <path d={shapes[name as keyof typeof shapes]} />}
    </svg>;
  };
}

export const EducationMark = mark("education");
export const MarketMark = mark("market");
export const AllocationMark = mark("allocation");
export const CounselMark = mark("advice");
export const PeopleMark = mark("people");
export const BusinessMark = mark("business");
export const DocumentMark = mark("document");
export const DialogueMark = mark("dialogue");
export const RiskMark = mark("risk");
export const TechnologyMark = mark("technology");
export const InsightMark = mark("insight");
export const ChainMark = mark("chain");
export const TokenMark = mark("token");
export const ScenarioMark = mark("scenario");
export const LibraryMark = mark("library");
export const ArrowRight = mark("arrow");
export const ArrowDown = mark("arrowDown");
export const MoveUpRight = mark("arrowOut");
export const ChevronDown = mark("chevron");
export const ChevronRight = mark("chevronRight");
export const Menu = mark("menu");
export const X = mark("close");
