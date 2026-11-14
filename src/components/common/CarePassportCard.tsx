import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    <section className="flex w-full flex-col rounded-xl bg-white p-5 shadow-[0_8px_12px_rgba(0,0,0,0.1)] font-comfortaa sm:min-h-[250px]">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base text-[#4A3C2A]">{petName || "Your pet"}'s care passport</h2>
        {passport?.completed ? <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs text-[#27AE60]">✓ Completed</span> : passport?.progress ? <span className="rounded-full border border-[#8B6357] px-2 py-0.5 text-[10px] text-[#4A3C2A]">{passport.progress}% completed</span> : null}
      </div>
      <div className="mt-5 flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1 text-xs leading-[1.45] text-[#4A5565]">
          <p className="text-[#B97829]">Why is {petName || "your pet"}'s passport required?</p>
          <p>Mutopia does not believe in one-size-fits-all grooming.</p>
          <ul className="ml-4 list-disc">
            <li>To calibrate custom water temperature, hypoallergenic shampoo, and gentle handling based on {petName || "your pet"}'s needs.</li>
            <li>To activate {petName || "your pet"}'s predictive AI Health Triage &amp; wellness tracking.</li>
          </ul>
          <p className="mt-4 text-[#B97829]">{passport?.completed ? "Your intake details are locked in. Our mobile salon and assigned groomer are now fully briefed for safe, personalized care." : "Our mobile unit requires verified care insights before arrival to guarantee safety."}</p>
        </div>
        <img src="/images/care-passport.png" alt="" className="h-28 w-24 shrink-0 object-contain" />
      </div>
      <button type="button" disabled={!petId && !onOpen} onClick={() => onOpen ? onOpen() : petId && navigate(`/care-passport/${petId}`, { state: { returnTo: location.pathname } })} className="mt-auto self-end rounded-full bg-[#B97829] px-6 py-2 text-sm text-white disabled:opacity-50">
        {passport?.completed ? "View or edit passport" : "Complete care passport"} →
      </button>
    </section>
  );
}
