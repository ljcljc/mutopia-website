import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuthStore } from "@/components/auth/authStore";

/** Owns the owner health-report email login redirect outside global headers. */
export default function HealthReportDeepLinkHandler() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const isHealthReportLink = searchParams.get("login") === "1";
  const requestedNext = searchParams.get("next");
  const destination = requestedNext?.startsWith("/account/pets") ? requestedNext : "/account/dashboard";

  useEffect(() => {
    if (!isHealthReportLink) return;
    if (user) navigate(destination, { replace: true });
    else setOpen(true);
  }, [destination, isHealthReportLink, navigate, user]);

  if (!isHealthReportLink) return null;
  return (
    <LoginModal open={open} onOpenChange={setOpen} onSuccess={() => navigate(destination, { replace: true })}>
      <span className="hidden" />
    </LoginModal>
  );
}
