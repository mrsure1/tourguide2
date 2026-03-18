export const CONVERSION_EVENTS = ["signup", "booking_created", "payment_success"] as const;

export type ConversionEventName = (typeof CONVERSION_EVENTS)[number];

