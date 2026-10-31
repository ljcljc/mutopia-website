import { useEffect, useState } from "react";
import { getPaymentMethods, type PaymentMethodOut } from "@/lib/api";
import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import { InfoEntryRow, SectionCard } from "@/components/account-center";

export default function PaymentMethodCard() {
  const showComingSoonMessage = useAccountStore(
    (state) => state.showComingSoonMessage
  );
  const [paymentMethods, setPaymentMethods] = useState<
    (PaymentMethodOut & { isDefault?: boolean })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPaymentMethods() {
      setIsLoading(true);
      setHasError(false);
      try {
        const methods: PaymentMethodOut[] = [];
        let page = 1;
        let total = 0;
        do {
          const response = await getPaymentMethods({ page, page_size: 100 });
          if (cancelled) return;
          methods.push(...response.items);
          total = response.total;
          if (response.items.length === 0) break;
          page += 1;
        } while (methods.length < total);
        setPaymentMethods(methods);
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadPaymentMethods();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const handleModify = () => {
    showComingSoonMessage("修改支付方式");
  };

  const handleDelete = () => {
    showComingSoonMessage("删除支付方式");
  };

  if (isLoading || (!hasError && paymentMethods.length === 0)) return null;

  return (
    <SectionCard className="mb-5 sm:mb-6 rounded-xl border border-[rgba(0,0,0,0.10)] p-5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:rounded-lg sm:p-6 sm:shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            name="credit"
            className="h-4 w-4 shrink-0 text-[#DE6A07] sm:h-5 sm:w-5"
          />
          <h2 className="font-comfortaa text-[14px] font-semibold text-[#4A3C2A] sm:text-lg">
            Payment method
          </h2>
        </div>
        <button
          onClick={handleModify}
          disabled={isLoading || hasError}
          className="flex items-center gap-2 text-[#8B6357] hover:text-[#DE6A07] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="font-comfortaa text-[12px] font-medium sm:text-sm">
            Modify
          </span>
          <Icon name="out-link" className="h-4 w-4" />
        </button>
      </div>

      {/* Payment Method List */}
      {hasError ? (
        <div role="alert" className="py-4 text-sm text-[#4A3C2A]">
          <p>Unable to load payment methods.</p>
          <button
            className="mt-2 cursor-pointer underline"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paymentMethods.map((method) => (
            <InfoEntryRow
              key={method.id}
              primaryText={
                method.last4
                  ? `**** **** **** ${method.last4}`
                  : "Saved payment method"
              }
              secondaryText={(
                method.brand ||
                method.method_type ||
                "Card"
              ).toUpperCase()}
              badgeText={method.isDefault ? "Default" : undefined}
              onDelete={method.isDefault ? undefined : handleDelete}
              deleteAriaLabel="Delete payment method"
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
