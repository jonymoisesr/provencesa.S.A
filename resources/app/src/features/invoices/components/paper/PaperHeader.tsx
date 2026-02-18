
import { CompanyProfile, Supplier } from "../../../../types";

interface PaperHeaderProps {
  supplier: Supplier;
  company: CompanyProfile; 
}

export const PaperHeader = ({ supplier }: PaperHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col items-start gap-1">
      {/* Supplier Name - Large, Bold */}
      <h1 className="text-2xl font-bold text-black uppercase tracking-tight leading-none">
        {supplier.name}
      </h1>
      
      {/* RIF - Bold below name */}
      <p className="text-lg font-bold text-black uppercase">
        RIF: {supplier.rif}
      </p>

      {/* Address and Contact Info - Single Line if possible, small text */}
      <div className="text-[10px] text-black uppercase leading-tight w-full max-w-2xl">
        <p>{supplier.address}</p>
        <p>TELÉFONOS: {supplier.phone_primary} {supplier.phone_contact ? `/ ${supplier.phone_contact}` : ''}</p>
      </div>
    </div>
  );
};
