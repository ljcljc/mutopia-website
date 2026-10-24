import type { ReactNode } from "react";
import { CheckCircleIcon } from "lucide-react";

type Props = {
  original: number;
  service: number;
  membership: number;
  tax: number;
  payable: number;
  offers: string[];
  paymentLabel: string;
  membershipVerb: "will be" | "was";
  toggle: ReactNode;
};

const money = (amount: number) => `$${amount.toFixed(2)}`;

export function EstimationPriceSummary({ original, service, membership, tax, payable, offers, paymentLabel, membershipVerb, toggle }: Props) {
  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {original > service && <span className="font-comfortaa text-[12.25px] text-[#4a5565]">was {money(original)}</span>}
        <p className="font-comfortaa text-[16px] font-bold text-[#de6a07]">{money(service)}</p>
        {toggle}
      </div>
      <p className="font-comfortaa text-[10px] text-[#de6a07]">Plus tax</p>
      {offers.length > 0 && (
        <div className="flex flex-wrap justify-end gap-2" aria-label="Applied offers">
          {offers.map((offer, index) => (
            <span key={`${offer}-${index}`} className="flex items-center gap-1 rounded-xl bg-[#dcfce7] px-3 py-1 font-comfortaa text-[10px] text-[#27ae60]">
              <CheckCircleIcon className="size-3.5" aria-hidden="true" />{offer}
            </span>
          ))}
        </div>
      )}
      {membership > 0 && <p className="font-comfortaa text-[12px] text-[#4a5565]">* {money(membership)} Membership fee {membershipVerb} added.</p>}
      <p className="font-comfortaa text-[12px] text-[#de6a07]">
        {paymentLabel}: {money(service)}{membership > 0 && ` + ${money(membership)}`} + {money(tax)} tax = {money(payable)}
      </p>
    </>
  );
}
