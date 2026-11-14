import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { getCarePassport, type CarePassportOut } from "@/lib/api";

export function CarePassportCard({ petId, petName, onOpen }: { petId: number | null; petName: string; onOpen?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [passport, setPassport] = useState<CarePassportOut | null>(null);

  useEffect(() => {
    if (!petId) { setPassport(null); return; }
    let active = true;
    getCarePassport(petId).then((result) => { if (active) setPassport(result); }).catch(() => setPassport(null));
    return () => { active = false; };
  }, [petId, location.key]);

  return (
    <section className="flex w-full flex-col rounded-xl bg-white p-5 font-comfortaa shadow-[0_8px_12px_rgba(0,0,0,0.1)] sm:min-h-[250px]">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-medium leading-5 text-[#4A3C2A] sm:text-base">{petName || "Your pet"}’s care passport</h2>
        {passport?.completed ? <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-1 text-[10px] leading-none text-[#27AE60]"><Icon name="check" size={9} aria-hidden="true" />Completed</span> : passport?.progress ? <span className="rounded-full border border-[#8B6357] px-2 py-1 text-[10px] leading-none text-[#4A3C2A]">{passport.progress}% completed</span> : null}
      </div>
      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row-reverse sm:items-start sm:justify-between sm:gap-5">
        <img src="/images/care-passport.png" alt="" className="h-24 w-24 shrink-0 object-contain sm:h-28" />
        <div className="min-w-0 flex-1 self-stretch text-xs leading-[1.35] text-[#4A3C2A]">
          <p className="font-medium text-[#de6a07]">Why is {petName || "your pet"}’s passport required?</p>
          <p>Mutopia does not believe in one-size-fits-all grooming.</p>
          <ul className="ml-4 list-disc">
            <li>To calibrate custom water temperature, hypoallergenic shampoo, and gentle handling based on {petName || "your pet"}’s needs.</li>
            <li>To activate {petName || "your pet"}’s predictive AI Health Triage &amp; wellness tracking.</li>
          </ul>
          <p className={`mt-4 font-medium ${passport?.completed ? "text-[#de6a07]" : "text-[#4A3C2A]"}`}>{passport?.completed ? "Your intake details are locked in. Our mobile salon and assigned groomer are now fully briefed for safe, personalized care." : "Our mobile unit requires verified care insights before arrival to guarantee safety."}</p>
        </div>
      </div>
      <button type="button" disabled={!petId && !onOpen} onClick={() => onOpen ? onOpen() : petId && navigate(`/care-passport/${petId}`, { state: { returnTo: location.pathname } })} className="mt-5 inline-flex min-h-9 w-full items-center justify-center rounded-full bg-[#de6a07] px-6 py-2 text-[13px] font-medium leading-5 text-white transition-colors hover:bg-[#c45e06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B6357] disabled:opacity-50 sm:mt-auto sm:w-auto sm:self-end">
        {passport?.completed ? "View or edit passport" : "Complete care passport"} →
      </button>
    </section>
  );
}
