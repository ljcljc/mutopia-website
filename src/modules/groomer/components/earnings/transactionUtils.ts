export type TransactionItemView = {
  key: string;
  title: string;
  subtitle: string;
  amount: string;
  detail?: string;
  tone: "positive" | "payout";
  bookingId: number;
  createdAt: string;
  isPositive: boolean;
  kind: string;
};

export type TransactionPageResult = {
  items: TransactionItemView[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getNumber(source: Record<string, unknown>, key: string, fallback = 0): number {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function getString(source: Record<string, unknown>, key: string, fallback = ""): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function getOptionalNumber(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function hasMeaningfulAmount(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value) > 0;
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function parseCurrency(value: string): number {
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function pickRicherDetail(primary?: string, secondary?: string): string | undefined {
  if (!primary) return secondary;
  if (!secondary) return primary;
  return secondary.length > primary.length ? secondary : primary;
}

function formatDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const timeLabel = parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const now = new Date();
  const isToday = parsed.getFullYear() === now.getFullYear()
    && parsed.getMonth() === now.getMonth()
    && parsed.getDate() === now.getDate();

  if (isToday) {
    return `Today, ${timeLabel}`;
  }

  const dateLabel = parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${dateLabel}, ${timeLabel}`;
}

function buildTransactionTitle(item: Record<string, unknown>, booking: Record<string, unknown>): string {
  const kind = getString(item, "kind");
  const description = getString(item, "description");
  const bookingId = getNumber(item, "booking_id");
  const petName = getString(booking, "pet_name");
  const serviceName = getString(booking, "service_name");
  const bookingTitle = petName && serviceName ? `${petName} - ${serviceName}` : "";

  if (kind === "service_earning" && bookingTitle) return bookingTitle;
  if (kind === "tip_earning" && bookingTitle) return bookingTitle;
  if (kind === "cash_out") return "Cash out";
  if (kind === "cash_out_fee") return "Cash out fee";
  if (kind === "penalty") return description || "Penalty";
  if (kind === "tip_earning") return bookingId > 0 ? `Booking #${bookingId} tip` : "Client tip";
  if (description) return description;
  return bookingId > 0 ? `Booking #${bookingId} service earning` : "Service earning";
}

function buildTransactionDetail(item: Record<string, unknown>, booking: Record<string, unknown>): string | undefined {
  const kind = getString(item, "kind");
  const paymentSummary = asRecord(booking.payment_summary);
  const packageAmount = getOptionalNumber(booking, "package_amount");
  const addonsAmount = getOptionalNumber(booking, "addons_amount") ?? 0;
  const tipAmount = getOptionalNumber(booking, "tip_amount") ?? 0;
  const basePaidAmount = getOptionalNumber(paymentSummary, "base_paid_amount");
  const additionalPaidAmount = getOptionalNumber(paymentSummary, "additional_paid_amount");
  const refundedAmount = getOptionalNumber(paymentSummary, "refunded_amount");
  const tipPaidAmount = getOptionalNumber(paymentSummary, "tip_paid_amount");

  if (kind === "service_earning") {
    if (
      hasMeaningfulAmount(basePaidAmount)
      || hasMeaningfulAmount(additionalPaidAmount)
      || hasMeaningfulAmount(refundedAmount)
      || hasMeaningfulAmount(tipPaidAmount)
    ) {
      const parts: string[] = [];
      if (hasMeaningfulAmount(basePaidAmount)) parts.push(formatCurrency(basePaidAmount));
      if (hasMeaningfulAmount(additionalPaidAmount)) parts.push(`+ ${formatCurrency(additionalPaidAmount)} extra`);
      if (hasMeaningfulAmount(refundedAmount)) parts.push(`- ${formatCurrency(refundedAmount)} refund`);
      if (hasMeaningfulAmount(tipPaidAmount)) parts.push(`+ ${formatCurrency(tipPaidAmount)} tip`);
      const hasAdjustment = hasMeaningfulAmount(additionalPaidAmount)
        || hasMeaningfulAmount(refundedAmount)
        || hasMeaningfulAmount(tipPaidAmount);
      return hasAdjustment ? parts.join(" ") : undefined;
    }

    const parts: string[] = [];
    if (packageAmount && packageAmount > 0) parts.push(formatCurrency(packageAmount));
    if (addonsAmount > 0) parts.push(`${formatCurrency(addonsAmount)} extra`);
    if (tipAmount > 0) parts.push(`${formatCurrency(tipAmount)} tip`);
    return parts.length > 1 ? parts.join(" + ") : undefined;
  }

  if (kind === "tip_earning") {
    const displayTipAmount = tipPaidAmount ?? tipAmount;
    if (displayTipAmount > 0) return `${formatCurrency(displayTipAmount)} tip`;
  }
  return undefined;
}

function shouldMergeBookingTransactions(current: TransactionItemView, previous: TransactionItemView): boolean {
  return current.isPositive
    && previous.isPositive
    && current.bookingId > 0
    && current.bookingId === previous.bookingId;
}

function mergeBookingTransactions(previous: TransactionItemView, current: TransactionItemView): TransactionItemView {
  const mergedAmount = formatCurrency(parseCurrency(previous.amount) + parseCurrency(current.amount));
  const serviceKind = previous.kind === "service_earning" || current.kind === "service_earning";
  const previousServiceDetail = previous.kind === "service_earning" ? previous.detail : undefined;
  const currentServiceDetail = current.kind === "service_earning" ? current.detail : undefined;
  const serviceDetail = pickRicherDetail(previousServiceDetail, currentServiceDetail);
  const mergedDetail = serviceDetail || pickRicherDetail(previous.detail, current.detail);

  return {
    ...previous,
    isPositive: true,
    kind: serviceKind ? "service_earning" : previous.kind,
    subtitle: previous.createdAt ? formatDateTime(previous.createdAt) : previous.subtitle,
    amount: `+${mergedAmount}`,
    detail: mergedDetail,
  };
}

export function mergeTransactionItems(items: TransactionItemView[]): TransactionItemView[] {
  return items.reduce<TransactionItemView[]>((result, current) => {
    const previous = result[result.length - 1];
    if (previous && shouldMergeBookingTransactions(current, previous)) {
      result[result.length - 1] = mergeBookingTransactions(previous, current);
      return result;
    }
    result.push(current);
    return result;
  }, []);
}

export function mapTransactionPage(raw: unknown): TransactionPageResult {
  const record = asRecord(raw);
  const items = Array.isArray(record.items) ? record.items : [];
  const total = getNumber(record, "total", items.length);
  const page = getNumber(record, "page", 1);
  const pageSize = getNumber(record, "page_size", items.length || 20);

  const mappedItems = items.map((entry, index) => {
    const item = asRecord(entry);
    const booking = asRecord(item.booking);
    const kind = getString(item, "kind");
    const amountValue = getNumber(item, "amount");
    const isPositive = kind === "service_earning" || kind === "tip_earning";
    const createdAt = getString(item, "created_at");

    return {
      key: `${getNumber(item, "id", index)}-${kind}-${createdAt}`,
      title: buildTransactionTitle(item, booking),
      subtitle: createdAt ? formatDateTime(createdAt) : "Recent transaction",
      amount: `${isPositive ? "+" : "-"}${formatCurrency(Math.abs(amountValue))}`,
      detail: buildTransactionDetail(item, booking),
      tone: isPositive ? "positive" : "payout",
      bookingId: getNumber(item, "booking_id", 0),
      createdAt,
      isPositive,
      kind,
    } satisfies TransactionItemView;
  });

  return {
    items: mergeTransactionItems(mappedItems),
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}
