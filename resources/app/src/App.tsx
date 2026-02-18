
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { SupplierListPage } from "./features/suppliers/pages/SupplierListPage";
import { InvoiceListPage } from "./features/invoices/pages/InvoiceListPage";
import { InvoiceCreatePage } from "./features/invoices/pages/InvoiceCreatePage";
import { InvoiceViewPage } from "./features/invoices/pages/InvoiceViewPage";
import { useEffect } from "react";
import { useSupplierStore } from "./store/useSupplierStore";
import { useInvoiceStore } from "./store/useInvoiceStore";

function App() {
  /* 
   * Zustand hooks return the state or a slice. 
   * To get the actions, we usually do: const actions = useStore.getState() or const { subscribe } = useStore()
   * However, useStore() returns the state, so we need to make sure 'subscribe' is part of the state. 
   * In my previous edit, I added 'subscribe' to the state object returned by create.
   */
  const subscribeSuppliers = useSupplierStore((state) => state.subscribe);
  const subscribeInvoices = useInvoiceStore((state) => state.subscribe);

  useEffect(() => {
    // These now return the unsubscribe function directly
    const unsubSuppliers = subscribeSuppliers();
    const unsubInvoices = subscribeInvoices();
    return () => {
      unsubSuppliers();
      unsubInvoices();
    };
  }, [subscribeSuppliers, subscribeInvoices]);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SupplierListPage />} />
          <Route path="/history" element={<InvoiceListPage />} />
          <Route path="/history/:supplierId" element={<InvoiceListPage />} />
          <Route path="/create/:supplierId" element={<InvoiceCreatePage />} />
          <Route path="/invoice/:id" element={<InvoiceViewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
