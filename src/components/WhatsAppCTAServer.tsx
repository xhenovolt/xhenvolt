import WhatsAppCTA from "./WhatsAppCTA";
import { getSetting } from "@/lib/repositories";

interface WhatsAppSetting {
  number?: string;
  prefilledMessage?: string;
  tooltip?: string;
}

export default async function WhatsAppCTAServer() {
  const cfg = await getSetting<WhatsAppSetting>("whatsapp", {});
  return (
    <WhatsAppCTA
      number={cfg.number}
      prefilledMessage={cfg.prefilledMessage}
      tooltip={cfg.tooltip}
    />
  );
}
