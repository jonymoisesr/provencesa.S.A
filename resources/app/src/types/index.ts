
export interface CompanyProfile {
  name: string; // Provencesa S.A
  rif: string; // J-08501973-1
  address: string; // Calle 4ta...
  phone: string; // 0212-2023111
  logo_url?: string;
}

export interface SupplierData {
  // Datos del Productor
  name: string;
  job_title: string; // Cargo o puesto
  rif: string; // Documento de identidad único
  address: string; // Dirección exacta
  phone_primary: string;
  phone_contact?: string;

  // Tipografía / datos impresos al final de la factura (multilinea)
  tipografia?: string;

  // Configuración de la "Plantilla" (Talonario)
  current_invoice_sequence: number; // Inicia en 0 (0000) y suma 1
  payment_conditions: "contado" | "credito";
  credit_days?: number; // Si es crédito

  created_at?: string;
}

export interface Supplier extends SupplierData {
  id: string;
}

export interface InvoiceItem {
  quantity: number;
  description: string;
  is_exempt: boolean; // La columna (E)
  unit_price: number;
  amount: number; // Importe Bs
}

export interface InvoiceData {
  provider_id: string;
  invoice_number: string;

  // Fecha desglosada
  day: string;
  month: string;
  year: string;
  full_date: string; // ISO string para ordenamiento

  // Montos globales
  subtotal: number; // SUB-TOTAL Bs.
  exempt_amount: number; // EXENTO Bs.
  tax_base: number; // BASE IMPONIBLE Bs.
  tax_percent: number; // % SOBRE Bs (IVA)
  tax_amount: number; // Monto del IVA
  total_pay: number; // TOTAL A PAGAR Bs.

  payment_method: string; // Forma de Pago (Contado, Crédito, etc.)

  items: InvoiceItem[]; // Lista de productos/servicios

  notes?: string;
  created_at?: string;
}

export interface Invoice extends InvoiceData {
  id: string;
}
