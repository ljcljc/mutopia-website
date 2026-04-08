import GroomerLayout from "@/modules/groomer/layout/GroomerLayout";
import GroomerRouteGuard from "@/modules/groomer/components/GroomerRouteGuard";
import GroomerDashboardPage from "@/modules/groomer/pages/GroomerDashboardPage";
import GroomerAccountPage from "@/modules/groomer/pages/GroomerAccountPage";
import GroomerMyWorkPage from "@/modules/groomer/pages/GroomerMyWorkPage";
import GroomerEarningsPage from "@/modules/groomer/pages/GroomerEarningsPage";
import GroomerMenuPage from "@/modules/groomer/pages/GroomerMenuPage";
import GroomerPerformancePage from "@/modules/groomer/pages/GroomerPerformancePage";

export const groomerRoutes = [
  {
    path: "/groomer",
    element: <GroomerLayout />,
    children: [
      {
        element: <GroomerRouteGuard />,
        children: [
          {
            path: "dashboard",
            element: <GroomerDashboardPage />,
          },
          {
            path: "account",
            element: <GroomerAccountPage />,
          },
          {
            path: "account/performance",
            element: <GroomerPerformancePage />,
          },
          {
            path: "my-work",
            element: <GroomerMyWorkPage />,
          },
          {
            path: "earnings",
            element: <GroomerEarningsPage />,
          },
          {
            path: "menu",
            element: <GroomerMenuPage />,
          },
        ],
      },
    ],
  },
];
