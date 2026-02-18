
import { Link, useLocation } from "react-router-dom";
import { FileText, PlusCircle, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Historial", icon: LayoutDashboard },
    { path: "/create", label: "Nueva Factura", icon: PlusCircle },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full shadow-xl z-50 print:hidden">
        <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <FileText size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Facturación
                </h1>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = location.pathname === item.path;
             return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon size={20} className={clsx("transition-transform group-hover:scale-110", isActive && "text-white")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
             );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
            &copy; 2024 Fundación Provencesa
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 z-50 flex justify-between items-center print:hidden">
         <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            <span className="font-bold">Facturación</span>
         </div>
         <div className="flex gap-4">
             {navItems.map((item) => (
                 <Link key={item.path} to={item.path} className={clsx(location.pathname === item.path ? "text-blue-400" : "text-slate-400")}>
                    <item.icon size={24} />
                 </Link>
             ))}
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 print:p-0 print:m-0 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto h-full print:max-w-none print:w-full">
            {children}
        </div>
      </main>
    </div>
  );
};
