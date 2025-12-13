import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFail from "@/pages/PaymentFail";

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
]);

