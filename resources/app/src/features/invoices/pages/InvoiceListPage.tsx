import { useInvoiceStore } from "../../../store/useInvoiceStore";
import { useSupplierStore } from "../../../store/useSupplierStore"; 
import { Link, useParams } from "react-router-dom";
import { Eye, Trash2, FileText, ArrowLeft } from "lucide-react";

export const InvoiceListPage = () => {
  const { invoices, deleteInvoice } = useInvoiceStore();
  const { suppliers } = useSupplierStore();
  const { supplierId } = useParams();

  const getSupplierName = (id: string) => {
    return suppliers.find(s => s.id === id)?.name || "Proveedor desconocido";
  };

  const filteredInvoices = supplierId 
    ? invoices.filter(inv => inv.provider_id === supplierId)
    : invoices;

  const supplierName = supplierId ? getSupplierName(supplierId) : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        {supplierId && (
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <ArrowLeft size={24} />
            </Link>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {supplierId ? `Facturas: ${supplierName}` : "Historial de Facturas"}
          </h1>
          <p className="text-slate-500 mt-1">
            {supplierId 
                ? `Mostrando ${filteredInvoices.length} facturas de este proveedor`
                : "Registro de todas las facturas emitidas"
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredInvoices.length === 0 ? (
           <div className="text-center py-20">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <FileText size={32} className="text-slate-300" />
               </div>
               <p className="text-slate-500">
                 {supplierId ? "No hay facturas para este proveedor." : "No hay facturas registradas aún."}
               </p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-medium">N° Factura</th>
                  {!supplierId && <th className="p-4 font-medium">Proveedor</th>}
                  <th className="p-4 font-medium">Fecha</th>
                  <th className="p-4 font-medium text-right">Monto Total</th>
                  <th className="p-4 font-medium text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">
                            #{invoice.invoice_number}
                        </span>
                    </td>
                    {!supplierId && (
                        <td className="p-4 text-slate-700">
                            {getSupplierName(invoice.provider_id)}
                        </td>
                    )}
                    <td className="p-4 text-slate-500 text-sm">
                        {invoice.day}/{invoice.month}/{invoice.year}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-900">
                        Bs. {invoice.total_pay.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                             <Link 
                                to={`/invoice/${invoice.id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver Factura"
                             >
                                <Eye size={18} />
                             </Link>
                             <button 
                                onClick={() => {
                                    if(confirm('¿Eliminar esta factura permanentemente?')) {
                                        deleteInvoice(invoice.id);
                                    }
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                             >
                                <Trash2 size={18} />
                             </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
