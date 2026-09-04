import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_init")

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Oncollably <oncollably@newnaija.ng>"
