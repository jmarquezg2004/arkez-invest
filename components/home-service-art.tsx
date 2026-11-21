const art = [
  { motif: "M17 76H51V57H85V39H120V20 M17 83H132 M29 26V74 M63 19V55 M97 15V38", focus: [120,20] },
  { motif: "M14 77L34 57L52 65L73 36L93 49L125 23 M14 85H132 M14 18V85", focus: [125,23] },
  { motif: "M19 83H132 M25 78V58H42V78 M55 78V46H72V78 M85 78V30H102V78 M115 78V18H132V78", focus: [124,18] },
] as const;

export function HomeServiceArt({ index }: { index: number }) {
  const { motif, focus: [x, y] } = art[index];
  return (
    <svg className="service-circuit" viewBox="0 0 150 100" aria-hidden="true">
      <path d="M12 27H137 M12 47H137 M12 67H137 M12 87H137 M35 13V87 M65 13V87 M95 13V87 M125 13V87" className="service-gridline" />
      <path d={motif} className="service-motif" />
      <circle cx={x} cy={y} r="8" className="service-halo" />
      <circle cx={x} cy={y} r="3.1" className="service-focus" />
    </svg>
  );
}
