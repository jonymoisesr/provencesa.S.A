
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { InvoiceData } from "../../../../types";

interface PaperMetaProps {
  register: UseFormRegister<InvoiceData>;
  watch: UseFormWatch<InvoiceData>;
  readOnly?: boolean;
}

export const PaperMeta = ({ register, watch, readOnly }: PaperMetaProps) => {
  const invoiceNumber = watch("invoice_number");

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {/* Invoice Number */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          N° Factura
        </span>
        <div className="flex items-center text-red-600 text-lg font-bold font-mono">
           {readOnly ? (
             <span>{invoiceNumber}</span>
           ) : (
             <input
               {...register("invoice_number")}
               className="w-full bg-transparent outline-none border-b border-red-100 focus:border-red-500 transition-colors"
               maxLength={10}
             />
           )}
        </div>
      </div>

      {/* Date */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">
          Fecha de Emisión
        </span>
        <div className="flex justify-between items-center text-center font-mono text-sm font-bold text-slate-800 px-2">
           <div className="flex-1">
             <input
               {...register("day")}
               className="w-full text-center bg-transparent outline-none placeholder-slate-300"
               placeholder="DD"
               maxLength={2}
               disabled={readOnly}
             />
             <span className="block text-[8px] text-slate-400 font-sans font-normal">DÍA</span>
           </div>
           <span className="text-slate-300 text-xs">/</span>
           <div className="flex-1">
             <input
               {...register("month")}
               className="w-full text-center bg-transparent outline-none placeholder-slate-300"
               placeholder="MM"
               maxLength={2}
               disabled={readOnly}
             />
             <span className="block text-[8px] text-slate-400 font-sans font-normal">MES</span>
           </div>
           <span className="text-slate-300 text-xs">/</span>
           <div className="flex-1">
             <input
               {...register("year")}
               className="w-full text-center bg-transparent outline-none placeholder-slate-300"
               placeholder="AAAA"
               maxLength={4}
               disabled={readOnly}
             />
             <span className="block text-[8px] text-slate-400 font-sans font-normal">AÑO</span>
           </div>
        </div>
      </div>

      {/* Control Number */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-right">
          N° de Control
        </span>
        <div className="text-right text-slate-700 font-mono text-lg tracking-tight">
          00-{invoiceNumber || "000000"}
        </div>
      </div>
    </div>
  );
};
