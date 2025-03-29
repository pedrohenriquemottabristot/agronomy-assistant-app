import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userName, onLogout }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const NavLinks = () => (
    <div className="flex items-center gap-6">
      <Link to="/dashboard" className="text-foreground hover:text-agro-primary transition-colors">
        Dashboard
      </Link>
      <Link to="/customers" className="text-foreground hover:text-agro-primary transition-colors">
        Clientes
      </Link>
      <Link to="/orders" className="text-foreground hover:text-agro-primary transition-colors">
        Pedidos
      </Link>
      <Link to="/products" className="text-foreground hover:text-agro-primary transition-colors">
        Produtos
      </Link>
    </div>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-2">
            <User size={18} />
            <span>{userName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button className="bg-agro-primary hover:bg-agro-dark" asChild>
            <Link to="/register">Cadastrar</Link>
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-agro-primary">AgroAssist</span>
          </Link>
          {!isMobile && <NavLinks />}
        </div>

        {isMobile ? (
          <div className="flex gap-4 items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 pt-10">
                  <Link to="/dashboard" className="text-lg font-medium">
                    Dashboard
                  </Link>
                  <Link to="/customers" className="text-lg font-medium">
                    Clientes
                  </Link>
                  <Link to="/orders" className="text-lg font-medium">
                    Pedidos
                  </Link>
                  <Link to="/products" className="text-lg font-medium">
                    Produtos
                  </Link>
                  <div className="mt-8">
                    <AuthButtons />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <AuthButtons />
        )}
      </div>
    </header>
  );
};

export default Header;
