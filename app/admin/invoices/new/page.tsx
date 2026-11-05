import { createClient } from "@/lib/supabase/server";
import { NewInvoiceForm } from "./NewInvoiceForm";

export default async function NewInvoicePage() {
  const db = await createClient();
  const { data: clients } = await db.from("clients").select("id, name").eq("status", "active").order("name");
  return (
    <div className="mx-auto grid max-w-lg gap-6">
      <div>
        <h1 className="text-h1">New draft invoice</h1>
        <p className="text-small text-ink-muted">One line item for now.</p>
      </div>
      <NewInvoiceForm clients={clients ?? []} />
    </div>
  );
}
