import Dashboard from "@/pages/account/Dashboard";
import BookingDetail from "@/pages/account/BookingDetail";
import AddPet from "@/pages/account/AddPet";
import MyPets from "@/pages/account/MyPets";
import MemorializedPets from "@/pages/account/MemorializedPets";
import Notifications from "@/pages/account/Notifications";
import MyAccount from "@/pages/account/MyAccount";

export const customerAccountRoutes = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "bookings/:bookingId",
    element: <BookingDetail />,
  },
  {
    path: "pets",
    element: <MyPets />,
  },
  {
    path: "pets/memorialized",
    element: <MemorializedPets />,
  },
  {
    path: "pets/new",
    element: <AddPet />,
  },
  {
    path: "notifications",
    element: <Notifications />,
  },
  {
    path: "profile",
    element: <MyAccount />,
  },
];
