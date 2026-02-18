

interface PaperTotalsProps {
  subtotal: number;
  exempt: number;
  taxBase: number;
  taxAmount: number;
  totalPay: number;
  taxPercent: number;
}

export const PaperTotals = ({
  subtotal,
  exempt,
  taxBase,
  taxAmount,
  totalPay,
  taxPercent,
}: PaperTotalsProps) => { // Removed unused clsx import if present in original by not importing it if not used, but using it for className
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="w-full md:w-1/2 ml-auto">
      <table className="w-full border-collapse border border-black text-xs">
        <tbody>
          <tr>
            <td className="border-r border-b border-black p-1 font-bold bg-gray-100 print:bg-transparent text-right w-1/2">SUB-TOTAL</td>
            <td className="border-b border-black p-1 text-right font-mono">{formatCurrency(subtotal)}</td>
          </tr>
          {/* Only show Exempt if > 0 to save space, or keep standard? Keeping standard for invoice structure usually better */}
          {exempt > 0 && (
              <tr>
                <td className="border-r border-b border-black p-1 font-bold bg-gray-100 print:bg-transparent text-right">EXENTO</td>
                <td className="border-b border-black p-1 text-right font-mono">{formatCurrency(exempt)}</td>
              </tr>
          )}
          <tr>
            <td className="border-r border-b border-black p-1 font-bold bg-gray-100 print:bg-transparent text-right">BASE IMPONIBLE</td>
            <td className="border-b border-black p-1 text-right font-mono">{formatCurrency(taxBase)}</td>
          </tr>
          <tr>
            <td className="border-r border-b border-black p-1 font-bold bg-gray-100 print:bg-transparent text-right">IVA {taxPercent}%</td>
            <td className="border-b border-black p-1 text-right font-mono">{formatCurrency(taxAmount)}</td>
          </tr>
          <tr>
            <td className="border-r border-black p-1 font-bold bg-gray-100 print:bg-transparent text-right text-sm">TOTAL A PAGAR</td>
            <td className="p-1 text-right font-bold font-mono text-sm">{formatCurrency(totalPay)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
