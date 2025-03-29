import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductCreate from "@/pages/ProductCreate";
import ProductDetails from "@/pages/ProductDetails";
import ProductEdit from "@/pages/ProductEdit";
import Orders from "@/pages/Orders";
import NewOrder from "@/pages/NewOrder";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout requireAuth>
                    <Dashboard />
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
                    <ProductCreate />
                  </Layout>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <Layout requireAuth>
                    <ProductDetails />
                  </Layout>
                }
              />
              <Route
                path="/products/:id/edit"
                element={
                  <Layout requireAuth>
                    <ProductEdit />
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
                path="/customers"
                element={
                  <Layout requireAuth>
                    <Customers />
                  </Layout>
                }
              />
              <Route
                path="/customers/:id"
                element={
                  <Layout requireAuth>
                    <CustomerDetails />
                  </Layout>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
