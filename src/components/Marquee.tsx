const WORDS = ["Casamentos", "Batizados", "Aniversários", "Eventos", "Ensaios"];

function Line() {
  return (
    <span className="font-display text-[26px] italic text-sand sm:text-[36px] lg:text-[44px]">
      {WORDS.map((w, i) => (
        <span key={w}>
          {w}
          <em className="mx-2.5 font-sans text-xl not-italic text-umber">·</em>
          {i === WORDS.length - 1 ? "" : ""}
        </span>
      ))}
    </span>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-black/10 py-14" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap motion-reduce:animate-none">
        <Line />
        <Line />
      </div>
    </div>
  );
}
