
import { useParams, useNavigate } from "react-router-dom";
import { useSupplierStore } from "../../../store/useSupplierStore";
import { useInvoiceStore } from "../../../store/useInvoiceStore";
import { InvoicePaper } from "../components/InvoicePaper";
import { CompanyProfile, InvoiceData, Invoice } from "../../../types";
import { v4 as uuidv4 } from "uuid";

export const InvoiceCreatePage = () => {
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const { suppliers } = useSupplierStore();
    const { addInvoice } = useInvoiceStore();

    const supplier = suppliers.find(s => s.id === supplierId);

    const company: CompanyProfile = {
        name: "Provencesa, S.A.",
        rif: "J-08501973-1",
        address: "Calle 4ta transversal C/2da Av Edificio centro empresarial Polar piso 1 of ppal Los Cortijos-Caracas",
        phone: "0212-2023111",
    };

    if (!supplier) {
        return (
            <div className="p-8 text-center text-red-500">
                Proveedor no encontrado. <button onClick={() => navigate("/")} className="underline">Volver</button>
            </div>
        );
    }

    const handleSave = (data: InvoiceData) => {
        const newInvoice: Invoice = {
            ...data,
            id: uuidv4(),
            provider_id: supplier.id, // Ensure link
            created_at: new Date().toISOString()
        };
        
        addInvoice(newInvoice);
        
        // Update supplier sequence
        // We might want to move this logic to the store action to keep it consistent
        // useSupplierStore.getState().updateSupplier(supplier.id, { current_invoice_sequence: supplier.current_invoice_sequence + 1 });
        
        navigate("/history");
    };

    return (
        <InvoicePaper 
            supplier={supplier} 
            company={company} 
            onSave={handleSave} 
            nextInvoiceNumber={supplier.current_invoice_sequence}
        />
    );
};
