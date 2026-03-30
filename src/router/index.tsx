import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AccountLayout from "@/components/layout/AccountLayout";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFail from "@/pages/PaymentFail";
import { customerAccountRoutes } from "@/modules/customer/routes";
import { groomerRoutes } from "@/modules/groomer/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "booking",
        element: <Booking />,
      },
      {
        path: "/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/fail",
        element: <PaymentFail />,
      },
    ],
  },
  {
    path: "/account",
    element: <AccountLayout />,
    children: customerAccountRoutes,
  },
  ...groomerRoutes,
]);
