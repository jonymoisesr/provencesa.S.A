import { create } from 'zustand';
import { Supplier } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

interface SupplierState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  subscribe: () => () => void; // Returns unsubscribe function
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  getSupplier: (id: string) => Supplier | undefined;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,

  subscribe: () => {
    set({ loading: true });
    const q = query(collection(db, 'suppliers'), orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const suppliers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Supplier[];
        set({ suppliers, loading: false, error: null });
      },
      (error) => {
        console.error("Error fetching suppliers:", error);
        set({ error: error.message, loading: false });
      }
    );
    return unsubscribe;
  },

  addSupplier: async (supplierData) => {
    try {
      await addDoc(collection(db, 'suppliers'), {
        ...supplierData,
        created_at: new Date().toISOString()
      });
    } catch (error) {
       console.error("Error adding supplier:", error);
       throw error;
    }
  },

  updateSupplier: async (id, data) => {
    try {
      const docRef = doc(db, 'suppliers', id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },

  deleteSupplier: async (id) => {
    try {
      await deleteDoc(doc(db, 'suppliers', id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  },

  getSupplier: (id) => get().suppliers.find((sup) => sup.id === id),
}));
