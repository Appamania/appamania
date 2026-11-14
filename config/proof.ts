export type Testimonial = { quote: string; name: string; role: string; company?: string };
/** Real quotes with written permission only. Empty renders nothing. */
export const testimonials: readonly Testimonial[] = [];
