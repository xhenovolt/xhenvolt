import { db, schema } from "@/lib/db";
import { inArray } from "drizzle-orm";
import {
  Card,
  Field,
  Input,
  PageHeader,
  PrimaryButton,
  Textarea,
} from "../_components/ui";
import { saveContact, saveWhatsapp, saveAi } from "./actions";

export const dynamic = "force-dynamic";

async function loadSettings() {
  if (!db) return new Map<string, Record<string, unknown>>();
  try {
    const rows = await db
      .select()
      .from(schema.settings)
      .where(inArray(schema.settings.key, ["contact", "whatsapp", "ai_assistant"]));
    const m = new Map<string, Record<string, unknown>>();
    for (const r of rows) m.set(r.key, (r.value as Record<string, unknown>) ?? {});
    return m;
  } catch {
    return new Map<string, Record<string, unknown>>();
  }
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const sp = await searchParams;
  const settings = await loadSettings();
  const contact = (settings.get("contact") ?? {}) as {
    address?: string;
    email?: string;
    secondaryEmail?: string;
    hours?: string;
    phones?: string[];
  };
  const whatsapp = (settings.get("whatsapp") ?? {}) as {
    number?: string;
    prefilledMessage?: string;
    tooltip?: string;
  };
  const ai = (settings.get("ai_assistant") ?? {}) as {
    name?: string;
    introMessage?: string;
    fallbackMessage?: string;
    suggestions?: string[];
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Global content controls. Changes propagate to the live site within seconds via cache revalidation."
      />

      {sp.saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-2">
          Saved <strong>{sp.saved}</strong> settings.
        </div>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Contact</h2>
          <form action={saveContact}>
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Address">
                  <Input
                    name="address"
                    required
                    defaultValue={contact.address ?? ""}
                    placeholder="Bulubandi, Iganga, Uganda"
                  />
                </Field>
                <Field label="Primary email">
                  <Input
                    name="email"
                    type="email"
                    required
                    defaultValue={contact.email ?? ""}
                    placeholder="drais@xhenvolt.com"
                  />
                </Field>
                <Field label="Secondary email (optional)">
                  <Input
                    name="secondaryEmail"
                    type="email"
                    defaultValue={contact.secondaryEmail ?? ""}
                  />
                </Field>
                <Field label="Hours">
                  <Input
                    name="hours"
                    defaultValue={contact.hours ?? ""}
                    placeholder="Mon–Fri, 8:00 AM – 6:00 PM EAT"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Phones" hint="One per line or comma-separated.">
                  <Textarea
                    name="phonesText"
                    rows={3}
                    required
                    defaultValue={(contact.phones ?? []).join("\n")}
                  />
                </Field>
              </div>
              <div className="mt-4 text-right">
                <PrimaryButton>Save contact</PrimaryButton>
              </div>
            </Card>
          </form>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">WhatsApp CTA</h2>
          <form action={saveWhatsapp}>
            <Card>
              <div className="grid grid-cols-1 gap-4">
                <Field label="Number" hint="Digits only, country code first.">
                  <Input
                    name="number"
                    required
                    defaultValue={whatsapp.number ?? ""}
                    placeholder="256741341483"
                  />
                </Field>
                <Field label="Prefilled message">
                  <Textarea
                    name="prefilledMessage"
                    rows={3}
                    required
                    defaultValue={whatsapp.prefilledMessage ?? ""}
                  />
                </Field>
                <Field label="Tooltip">
                  <Input
                    name="tooltip"
                    required
                    defaultValue={whatsapp.tooltip ?? ""}
                  />
                </Field>
              </div>
              <div className="mt-4 text-right">
                <PrimaryButton>Save WhatsApp</PrimaryButton>
              </div>
            </Card>
          </form>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Xhenvolt AI Assistant</h2>
          <form action={saveAi}>
            <Card>
              <div className="grid grid-cols-1 gap-4">
                <Field label="Name">
                  <Input
                    name="name"
                    required
                    defaultValue={ai.name ?? "Xhenvolt AI"}
                  />
                </Field>
                <Field label="Intro message">
                  <Textarea
                    name="introMessage"
                    rows={3}
                    required
                    defaultValue={ai.introMessage ?? ""}
                  />
                </Field>
                <Field
                  label="Fallback message"
                  hint="Shown when retrieval can't find a confident match."
                >
                  <Textarea
                    name="fallbackMessage"
                    rows={3}
                    required
                    defaultValue={ai.fallbackMessage ?? ""}
                  />
                </Field>
                <Field label="Suggestions" hint="One per line. Shown as quick-action chips.">
                  <Textarea
                    name="suggestionsText"
                    rows={5}
                    defaultValue={(ai.suggestions ?? []).join("\n")}
                  />
                </Field>
              </div>
              <div className="mt-4 text-right">
                <PrimaryButton>Save AI</PrimaryButton>
              </div>
            </Card>
          </form>
        </section>
      </div>
    </div>
  );
}
