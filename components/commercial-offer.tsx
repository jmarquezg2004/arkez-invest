import { inquiryHref, offers } from "@/lib/commercial-offers";

export function CommercialOffer({ path }: { path: string }) {
  const offer = offers.find(({ href }) => href === path);
  if (!offer) return null;

  return (
    <section className="commercial-offer" aria-labelledby="offer-heading">
      <div>
        <h2 id="offer-heading">Qué incluye el servicio</h2>
        <p>{offer.contents}</p>
      </div>
      <dl>
        <div><dt>Para quién</dt><dd>{offer.audience}</dd></div>
        <div><dt>Qué te llevas</dt><dd>{offer.outcome}</dd></div>
        <div><dt>Modalidad</dt><dd>{offer.format}</dd></div>
      </dl>
      <a className="button button-dark" href={inquiryHref(offer.id)}>Solicitar información</a>
    </section>
  );
}
