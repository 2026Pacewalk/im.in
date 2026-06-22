// Client-safe WCPA types + constants (no server-only imports).
export const WHATSAPP_NUMBER = "917307344844";

export interface WcpaOption {
  label: string;
  price: number;
  value: string;
}
export type WcpaFieldType =
  | "checkbox-group"
  | "radio-group"
  | "select"
  | "text"
  | "textarea"
  | "separator";

export interface WcpaField {
  id: string;
  type: WcpaFieldType;
  title: string;
  helptext?: string;
  options: WcpaOption[];
}
