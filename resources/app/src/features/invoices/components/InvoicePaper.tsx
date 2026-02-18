
import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Save } from "lucide-react"; 
import { clsx } from "clsx";
import type {
  Supplier,
  Invoice,
  InvoiceData,
  CompanyProfile,
} from "../../../types";

// Import new modular components
import { PaperHeader } from "./paper/PaperHeader";
import { PaperRecipient } from "./paper/PaperRecipient";
import { PaperMeta } from "./paper/PaperMeta";
import { PaperItemsTable } from "./paper/PaperItemsTable";
import { PaperTotals } from "./paper/PaperTotals";
import { PaperFooter } from "./paper/PaperFooter";

interface InvoicePaperProps {
  supplier: Supplier;
  company: CompanyProfile;
  onSave: (data: InvoiceData) => void;
  nextInvoiceNumber: number;
  invoice?: Invoice;
  readOnly?: boolean;
}

export const InvoicePaper = ({
  supplier,
  company,
  onSave,
  nextInvoiceNumber,
  invoice,
  readOnly = false,
}: InvoicePaperProps) => {
  // Formatear fecha actual
  const today = useMemo(() => new Date(), []);
  const fixedTaxPercent = 16;

  const defaultValues: InvoiceData = useMemo(() => {
    if (invoice) {
        return {
          provider_id: invoice.provider_id,
          invoice_number: invoice.invoice_number,
          day: invoice.day,
          month: invoice.month,
          year: invoice.year,
          full_date: invoice.full_date,
          subtotal: invoice.subtotal,
          exempt_amount: invoice.exempt_amount,
          tax_base: invoice.tax_base,
          tax_percent: fixedTaxPercent,
          tax_amount: invoice.tax_amount,
          total_pay: invoice.total_pay,
          payment_method: invoice.payment_method,
          items: invoice.items,
          notes: invoice.notes,
          created_at: invoice.created_at,
        };
      }
  
      return {
        provider_id: supplier.id,
        invoice_number: nextInvoiceNumber.toString().padStart(6, "0"),
        day: today.getDate().toString().padStart(2, "0"),
        month: (today.getMonth() + 1).toString().padStart(2, "0"),
        year: today.getFullYear().toString(),
        full_date: today.toISOString(),
        items: [
          {
            quantity: 0,
            description: "",
            is_exempt: true,
            unit_price: 0,
            amount: 0,
          },
        ],
        payment_method:
          supplier.payment_conditions === "credito"
            ? `Crédito ${supplier.credit_days} días`
            : "Contado",
        tax_percent: fixedTaxPercent,
        subtotal: 0,
        exempt_amount: 0,
        tax_base: 0,
        tax_amount: 0,
        total_pay: 0,
      };
  }, [
    fixedTaxPercent,
    invoice,
    nextInvoiceNumber,
    supplier.id,
    supplier.payment_conditions,
    supplier.credit_days,
    today,
  ]);

  const { register, control, handleSubmit, setValue, watch, reset } =
    useForm<InvoiceData>({
      defaultValues,
    });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // Force tax percent
  useEffect(() => {
    setValue("tax_percent", fixedTaxPercent);
  }, [fixedTaxPercent, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Real-time calculations
  const items = useWatch({ control, name: "items" });
  
  const totals = useMemo(() => {
    let subtotal = 0;
    let exempt = 0;

    items.forEach((item: any) => {
      const amount = (item.quantity || 0) * (item.unit_price || 0);
      subtotal += amount;
      if (item.is_exempt) {
        exempt += amount;
      }
    });

    const taxBase = subtotal - exempt;
    const taxAmount = taxBase * (fixedTaxPercent / 100);
    const totalPay = subtotal + taxAmount;

    return { subtotal, exempt, taxBase, taxAmount, totalPay };
  }, [items, fixedTaxPercent]);

  // Sync totals to form
  useEffect(() => {
    setValue("subtotal", totals.subtotal);
    setValue("exempt_amount", totals.exempt);
    setValue("tax_base", totals.taxBase);
    setValue("tax_amount", totals.taxAmount);
    setValue("total_pay", totals.totalPay);
  }, [totals, setValue]);

  const handleAppendItem = () => {
    if (readOnly) return;
    append({
      quantity: 0,
      description: "",
      is_exempt: true,
      unit_price: 0,
      amount: 0,
    });
  };

  return (
    <div className="invoice-wrapper min-h-screen bg-slate-100/50 py-8 px-4 flex justify-center items-start">
      
      {/* Paper Container */}
      <div className={clsx(
        "bg-white w-full max-w-[1000px] shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none print:w-full print:max-w-none",
        "flex flex-col",
        "transition-all duration-300 ease-in-out",
        "print:h-screen print:overflow-hidden" // Force single page height
      )}>
        
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 w-full print:hidden"></div>

        <form onSubmit={handleSubmit(onSave)} className="p-8 md:p-12 print:p-8 flex-1 flex flex-col h-full justify-between">
          {/* Metadata Helpers */}
          <input type="hidden" {...register("provider_id")} />
          <input type="hidden" {...register("tax_percent")} />
          
          {/* HEADER */}
          <PaperHeader supplier={supplier} company={company} />

          {/* RECIPIENT INFO */}
          <PaperRecipient company={company} invoice={invoice} />

          {/* INVOICE METADATA (Number, Date, Control) */}
          <PaperMeta register={register} watch={watch} readOnly={readOnly} />

          {/* ITEMS TABLE */}
          <PaperItemsTable 
            fields={fields as any} 
            register={register} 
            watch={watch} 
            remove={remove} 
            handleAppendItem={handleAppendItem}
            readOnly={readOnly}
          />

          {/* TOTALS and FOOTER */}
          <div className="mt-auto">
             <div className="flex flex-col md:flex-row gap-4 items-end">
                 {/* Footer Warning/Notes Left */}
                 <div className="w-full md:w-1/2">
                    <div className="p-2 border border-black text-center text-xs font-bold bg-gray-100 print:bg-transparent mb-2">
                        ESTA FACTURA VA SIN TACHADURA NI ENMIENDA
                    </div>
                    <div className="p-2 border border-black text-center text-xs font-bold bg-gray-100 print:bg-transparent mb-2">
                        ORIGINAL
                    </div>
                     {invoice?.notes && (
                         <div className="text-xs italic border border-black p-1">    
                             Nota: {invoice.notes}
                         </div>
                     )}
                 </div>

                 {/* Totals Right */}
                 <PaperTotals 
                    subtotal={totals.subtotal}
                    exempt={totals.exempt}
                    taxBase={totals.taxBase}
                    taxAmount={totals.taxAmount}
                    totalPay={totals.totalPay}
                    taxPercent={fixedTaxPercent}
                 />
             </div>
             
             {/* Final Legal Text */}
             <PaperFooter note={""} supplier={supplier} />
          </div>

          {/* Floating Save Button */}
          {!readOnly && (
            <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up no-print">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <Save size={20} />
                <span>Guardar Factura</span>
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
