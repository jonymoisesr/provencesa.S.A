
import { useState } from "react";
import { useSupplierStore } from "../../../store/useSupplierStore";
import { Plus, Search, FileText, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Supplier } from "../../../types";

export const SupplierListPage = () => {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier, loading, error } = useSupplierStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const initialSupplierState: Partial<Supplier> = {
        name: "",
        rif: "",
        address: "",
        phone_primary: "",
        payment_conditions: "contado",
        current_invoice_sequence: 125,
        tipografia: "",
        job_title: "Servicios Profesionales"
    };

    const [formData, setFormData] = useState<Partial<Supplier>>(initialSupplierState);

    const filteredSuppliers = suppliers.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.rif.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (supplier: Supplier) => {
        setFormData(supplier);
        setEditingId(supplier.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleOpenCreate = () => {
        setFormData(initialSupplierState);
        setIsEditing(false);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSuccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.name || !formData.rif) return;
        
        if (isEditing && editingId) {
            await updateSupplier(editingId, formData);
        } else {
            await addSupplier(formData as Omit<Supplier, "id">);
        }

        setIsModalOpen(false);
        setFormData(initialSupplierState);
    };

    if (loading && suppliers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
         return (
            <div className="p-8 text-center text-red-600">
                <h2 className="text-xl font-bold mb-2">Error de conexión</h2>
                <p>{error}</p>
                <p className="text-sm mt-4 text-slate-500">Verifica tu conexión a internet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Proveedores</h1>
                    <p className="text-slate-500 mt-1">Gestiona tus proveedores y crea nuevas facturas</p>
                </div>
                <button 
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                >
                    <Plus size={20} />
                    <span>Agregar Proveedor</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o RIF..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            {suppliers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No hay proveedores registrados</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">Agrega tu primer proveedor para comenzar a crear facturas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.map((supplier) => (
                        <div key={supplier.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                             <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                                    {supplier.name.charAt(0)}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(supplier)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(confirm('¿Estás seguro de eliminar este proveedor?')) {
                                                deleteSupplier(supplier.id);
                                            }
                                        }}
                                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                             </div>
                             
                             <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{supplier.name}</h3>
                             <p className="text-sm text-slate-500 font-mono mb-4">{supplier.rif}</p>

                             <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Próxima Factura:</span>
                                    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                        #{supplier.current_invoice_sequence.toString().padStart(6, '0')}
                                    </span>
                                </div>
                             </div>

                             <div className="flex gap-2">
                                <Link 
                                    to={`/create/${supplier.id}`}
                                    className="flex-1 py-2.5 text-center bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm"
                                >
                                    Crear Factura
                                </Link>
                                <Link 
                                    to={`/history/${supplier.id}`}
                                    className="flex-1 py-2.5 text-center bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm"
                                >
                                    Ver Facturas
                                </Link>
                             </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold">{isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSuccess} className="p-6 space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Nombre / Razón Social</span>
                                    <input required type="text" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 py-2 px-3 border" 
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">RIF</span>
                                    <input required type="text" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 py-2 px-3 border"
                                        value={formData.rif} onChange={e => setFormData({...formData, rif: e.target.value})}
                                    />
                                </label>
                                <label className="block md:col-span-2">
                                    <span className="text-sm font-medium text-slate-700">Dirección Fiscal</span>
                                    <textarea className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 py-2 px-3 border"
                                        rows={2}
                                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Teléfono</span>
                                    <input type="text" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 py-2 px-3 border"
                                        value={formData.phone_primary} onChange={e => setFormData({...formData, phone_primary: e.target.value})}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Cargo / Título</span>
                                    <input type="text" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 py-2 px-3 border"
                                        value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Próximo correlativo factura</span>
                                    <input type="number" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 py-2 px-3 border"
                                        value={formData.current_invoice_sequence} onChange={e => setFormData({...formData, current_invoice_sequence: parseInt(e.target.value)})}
                                    />
                                </label>
                                <label className="block md:col-span-2">
                                    <span className="text-sm font-medium text-slate-700">Tipografía (Texto Legal al Pie de Página)</span>
                                    <textarea className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 py-2 px-3 border font-mono text-xs"
                                        rows={4}
                                        placeholder="IMPRESO POR LITOGRAFICAS EJEMPLO RIF J-00000000-0..."
                                        value={formData.tipografia} onChange={e => setFormData({...formData, tipografia: e.target.value})}
                                    />
                                </label>
                             </div>
                             <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    {isEditing ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                                </button>
                             </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
