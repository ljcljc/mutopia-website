import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AccountLayout from "@/components/layout/AccountLayout";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFail from "@/pages/PaymentFail";
import Dashboard from "@/pages/account/Dashboard";
import MyPets from "@/pages/account/MyPets";
import Notifications from "@/pages/account/Notifications";
import MyAccount from "@/pages/account/MyAccount";

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
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "pets",
        element: <MyPets />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "profile",
        element: <MyAccount />,
      },
    ],
  },
]);

