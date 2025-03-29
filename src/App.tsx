import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import NotFound from "./pages/NotFound";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <Layout requireAuth>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/orders"
              element={
                <Layout requireAuth>
                  <Orders />
                </Layout>
              }
            />
            <Route
              path="/orders/new"
              element={
                <Layout requireAuth>
                  <NewOrder />
                </Layout>
              }
            />
            <Route
              path="/products"
              element={
                <Layout requireAuth>
                  <Products />
                </Layout>
              }
            />
            <Route
              path="/products/new"
              element={
                <Layout requireAuth>
                  <NewProduct />
                </Layout>
              }
            />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
