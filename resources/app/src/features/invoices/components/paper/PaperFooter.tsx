
import { Supplier } from "../../../../types";

interface PaperFooterProps {
    note?: string; // Kept for interface compatibility but main warnings moved
    supplier?: Supplier;
  }
  
  export const PaperFooter = ({ supplier }: PaperFooterProps) => {
    return (
      <div className="mt-4 pt-1 border-t border-black">
         <p className="text-[8px] text-black uppercase leading-tight font-mono text-justify whitespace-pre-wrap">
           {supplier?.tipografia || ""}
         </p>
      </div>
    );
  };
