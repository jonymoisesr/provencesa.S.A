
import { useParams, useNavigate } from "react-router-dom";
import { useInvoiceStore } from "../../../store/useInvoiceStore";
import { useSupplierStore } from "../../../store/useSupplierStore";
import { InvoicePaper } from "../components/InvoicePaper";
import { CompanyProfile } from "../../../types";
import { Printer, ArrowLeft } from "lucide-react";

export const InvoiceViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getInvoice } = useInvoiceStore();
    const { suppliers } = useSupplierStore();

    const invoice = getInvoice(id || "");
    const supplier = invoice ? suppliers.find(s => s.id === invoice.provider_id) : undefined;

    const company: CompanyProfile = {
        name: "Provencesa, S.A.",
        rif: "J-08501973-1",
        address: "Calle 4ta transversal C/2da Av Edificio centro empresarial Polar piso 1 of ppal Los Cortijos-Caracas",
        phone: "0212-2023111",
    };

    if (!invoice || !supplier) {
        return (
            <div className="p-8 text-center text-red-500">
                Factura o Proveedor no encontrado. <button onClick={() => navigate("/history")} className="underline">Volver</button>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="relative">
            {/* Header Actions - Hidden on Print */}
            <div className="mb-6 flex justify-between items-center print:hidden">
                <button 
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Volver al historial</span>
                </button>

                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                >
                    <Printer size={20} />
                    <span>Imprimir / Descargar PDF</span>
                </button>
            </div>

            <InvoicePaper 
                supplier={supplier} 
                company={company} 
                onSave={() => {}} // No-op for read-only
                nextInvoiceNumber={parseInt(invoice.invoice_number)} // Just for display
                invoice={invoice}
                readOnly={true}
            />
        </div>
    );
};
