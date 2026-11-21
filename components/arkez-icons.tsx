import type { SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };
const shapes = {
  education: "M3 18.5 12 22l9-3.5V6l-9 3.5L3 6v12.5ZM12 9.5V22M6 4.5 12 2l6 2.5M6 10.5l3 1.2m-3 2.5 3 1.2m6-3.7 3-1.2",
  market: "M3 3v17h18M6 14l4-4 4 2 5-6M16 6h3v3M6 17h2m3 0h2m3 0h3",
  allocation: "M3 12 12 3l9 9-9 9-9-9Zm3 3 6-6 6 6m-6-6v12M3 12h6m6 0h6",
  advice: "M3 4h10v6H3zm8 10h10v6H11zM7 10v7h4m2-10h4v7M6 7h4m4 10h4",
  people: "M4 21v-3l4-3h8l4 3v3M3 21h18M12 4l4 4-4 4-4-4 4-4ZM6 5 3 8l3 3m12-6 3 3-3 3",
  business: "M2.5 21h19M5 21V9l7-5v17m0-11 7 3v8M8 12v1m0 3v1m8-2v2m0 2v2",
  document: "M5 3h9l5 5v13H5V3Zm9 0v5h5M8 12h8m-8 4h8",
  dialogue: "M3 4h18v12h-9l-5 4v-4H3V4Zm4 5h10m-10 3h7",
  risk: "M3 13 12 3l9 10-9 8-9-8Zm5 0h8m-4-5v9",
  technology: "M3 6h18M3 12h18M3 18h18M7 4v4m9 2v4m-6 2v4",
  insight: "M3 17h18M4 13l4-5 4 3 4-6 4 3M8 5v1m4 7v2m4-2v2m4-3v2",
  chain: "M3 8h7v8H3zm11 0h7v8h-7zM10 12h4M6.5 5v3m11 8v3",
  token: "M12 3 21 8v8l-9 5-9-5V8l9-5ZM3 8l9 5 9-5m-9 5v8m-4.5-15.5 9 5",
  scenario: "M4 5h16v14H4zM4 10h16M9 10v9m6-9v9m-8-3h0m5-3h0m5 2h0",
  arrow: "M4 12h15m-5-5 5 5-5 5",
  arrowDown: "M12 4v15m-5-5 5 5 5-5",
  arrowOut: "M6 18 18 6M9 6h9v9",
  chevron: "m7 10 5 5 5-5",
  chevronRight: "m10 7 5 5-5 5",
  menu: "M3 7h18M3 12h14m-14 5h18",
  close: "m6 6 12 12M18 6 6 18",
} as const;

function mark(name: keyof typeof shapes) {
  return function ArkezMark({ size = 24, strokeWidth = 1.55, ...props }: IconProps) {
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true" data-mark={name} {...props}>
      <path d={shapes[name]} />
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
export const ArrowRight = mark("arrow");
export const ArrowDown = mark("arrowDown");
export const MoveUpRight = mark("arrowOut");
export const ChevronDown = mark("chevron");
export const ChevronRight = mark("chevronRight");
export const Menu = mark("menu");
export const X = mark("close");
