
import { UseFieldArrayReturn, UseFormRegister, UseFormWatch } from "react-hook-form";
import { InvoiceData } from "../../../../types";
import { Trash2 } from "lucide-react";

interface PaperItemsTableProps {
  fields: UseFieldArrayReturn<InvoiceData, "items", "id">["fields"];
  register: UseFormRegister<InvoiceData>;
  watch: UseFormWatch<InvoiceData>;
  remove: UseFieldArrayReturn<InvoiceData, "items", "id">["remove"];
  handleAppendItem: () => void; // Used for "Enter" key on last item
  readOnly?: boolean;
}

export const PaperItemsTable = ({
  fields,
  register,
  watch,
  remove,
  handleAppendItem,
  readOnly,
}: PaperItemsTableProps) => {

  return (
    <div className="mb-4">
      {/* Table Header */}
      <div className="grid grid-cols-[60px_1fr_30px_90px_100px] gap-2 px-2 py-1 bg-slate-50 border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
        <div className="text-center">Cant.</div>
        <div>Descripción</div>
        <div className="text-center" title="Exento">Ex</div>
        <div className="text-right">Precio U.</div>
        <div className="text-right">Total</div>
      </div>

      {/* Table Body */}
      <div className="space-y-0 text-xs">
        {fields.map((field, index) => {
          const qty = watch(`items.${index}.quantity`);
          const price = watch(`items.${index}.unit_price`);
          const amount = (qty || 0) * (price || 0);

          return (
            <div
              key={field.id}
              className="group relative grid grid-cols-[60px_1fr_30px_90px_100px] gap-2 px-2 py-1 border-b border-slate-50 hover:bg-slate-50/50 transition-colors items-start"
            >
              {/* Quantity */}
              <input
                type="number"
                step="0.01"
                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                className="w-full text-center bg-transparent outline-none font-mono text-slate-700 focus:text-blue-600 focus:font-bold transition-all"
                placeholder="0"
                disabled={readOnly}
              />

              {/* Description */}
              {readOnly ? (
                 <div className="w-full text-slate-800 leading-tight whitespace-pre-wrap break-words font-medium">
                     {watch(`items.${index}.description`)}
                 </div>
              ) : (
                <textarea
                    {...register(`items.${index}.description`)}
                    rows={1}
                    className="w-full bg-transparent outline-none resize-none overflow-hidden text-slate-800 leading-tight custom-textarea"
                    placeholder="Descripción del item..."
                    onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto'; 
                    target.style.height = `${target.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (index === fields.length - 1) {
                            handleAppendItem();
                        }
                    }
                    }}
                    style={{ minHeight: '24px' }}
                />
              )}

              {/* Is Exempt */}
              <div className="flex justify-center items-center">
                 <span className="text-[10px] font-bold text-slate-400">
                    {(watch(`items.${index}.is_exempt`) ?? true) ? "E" : ""}
                 </span>
              </div>

              {/* Unit Price */}
              <input
                type="number"
                step="0.01"
                {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                className="w-full text-right bg-transparent outline-none font-mono text-slate-700 focus:text-blue-600 transition-colors"
                placeholder="0.00"
                disabled={readOnly}
              />

              {/* Amount */}
              <div className="text-right font-mono font-medium text-slate-900">
                {amount.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
              </div>

               {/* Delete Action (Hover) */}
               {!readOnly && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute -right-3 top-2 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                  title="Eliminar fila"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Empty State / Add Hint */}
      {fields.length === 0 && (
         <div className="text-center py-4 text-slate-400 italic text-xs">
            No hay items en la factura. Agrega una línea para comenzar.
         </div>
      )}
    </div>
  );
};
