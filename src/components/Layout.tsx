import React, { ReactNode } from "react";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Users, ShoppingCart, Package, Home } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = false }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (requireAuth && !isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isLoggedIn={isAuthenticated} 
        userName={user?.name} 
        onLogout={logout} 
      />
      <main className="flex-grow">{children}</main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AgroAssist. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
