
import { CompanyProfile, Invoice } from "../../../../types";

interface PaperRecipientProps {
  company: CompanyProfile; // client (Provencesa)
  invoice?: Invoice;
}

export const PaperRecipient = ({ company, invoice }: PaperRecipientProps) => {
  return (
    <div className="border border-black mb-4 text-xs">
        {/* Row 1: Nombre o Razon Social */}
        <div className="border-b border-black flex">
            <div className="w-32 p-1 border-r border-black font-bold bg-gray-100 print:bg-transparent">
                NOMBRE O RAZÓN SOCIAL:
            </div>
            <div className="flex-1 p-1 uppercase font-medium">
                {company.name}
            </div>
        </div>

        {/* Row 2: Domicilio Fiscal */}
        <div className="border-b border-black flex">
             <div className="w-32 p-1 border-r border-black font-bold bg-gray-100 print:bg-transparent">
                DOMICILIO FISCAL:
            </div>
            <div className="flex-1 p-1 uppercase">
                {company.address}
            </div>
        </div>

        {/* Row 3: RIF | Telefono | Condiciones */}
        <div className="flex border-b border-black">
             {/* RIF */}
             <div className="flex-1 flex border-r border-black">
                 <div className="w-16 p-1 border-r border-black font-bold bg-gray-100 print:bg-transparent">
                    N° RIF:
                 </div>
                 <div className="p-1 uppercase flex-1 text-center">
                    {company.rif}
                 </div>
             </div>
             
             {/* PHONE */}
             <div className="flex-1 flex border-r border-black">
                 <div className="w-20 p-1 border-r border-black font-bold bg-gray-100 print:bg-transparent">
                    TELÉFONO:
                 </div>
                 <div className="p-1 uppercase flex-1 text-center">
                    {company.phone}
                 </div>
             </div>

             {/* Payment Condition */}
             <div className="flex-1 flex">
                 <div className="w-24 p-1 flex-1 font-bold text-center bg-gray-100 print:bg-transparent">
                    {invoice?.payment_method || "CONTADO"}
                 </div>
             </div>
        </div>
    </div>
  );
};
