import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layout/AppLayout";
import Error from "./reusable/components/basic1/Error";
import Homepage from "./pages/mainPage/Homepage";
import RegistryUserList from "./pages/user/RegistryUserList";
import GlobalProvider from "./context/GlobalProvider";
import RegistryUserForm from "./pages/user/RegistryUserForm";
import ConfirmedUserList from "./pages/user/ConfirmedUserList";
import ConfirmedUserForm from "./pages/user/ConfirmedUserForm";
import ManageUsers from "./pages/user/ManageUsers";
import Login from "./pages/mainPage/Login";
import ProtectedRoutes from "./context/ProtectedRoutes";
import UserWeeklyScheduleFormCustom from "./pages/userSchedule/UserWeeklyScheduleFormCustom";
import UserSchedule from "./pages/userSchedule/userSchedule/UserSchedule";
import UserScheduleProvider from "./pages/userSchedule/userSchedule/UserScheduleProvider";
import UserTimeLogForm from "./pages/userSchedule/userSchedule/UserTimeLogForm";
import UserScheduleForm from "./pages/userSchedule/userSchedule/UserScheduleForm";
import EventForm from "./pages/userSchedule/userSchedule/EventForm";
import EventOptions from "./pages/userSchedule/userSchedule/EventOptions";
import UserFinalTimelogForm from "./pages/userSchedule/userSchedule/UserFinalTimelogForm";
import UserWageForm from "./pages/userSchedule/userSchedule/UserWageForm";

const routes = [
  {
    element: (
      <ProtectedRoutes>
        <AppLayout />
      </ProtectedRoutes>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate replace to="homepage" />,
      },

      {
        path: "homepage",
        element: <Homepage />,
      },
      {
        path: "homepage/registryUserList",
        element: <RegistryUserList />,
      },
      {
        path: "homepage/registryUserList/registryUserForm",
        element: <RegistryUserForm />,
      },
      {
        path: "homepage/registryUserList/registryUserForm/:id",
        element: <RegistryUserForm />,
      },

      {
        path: "homepage/confirmUserList",
        element: <ConfirmedUserList />,
      },
      {
        path: "homepage/confirmUserList/confirmedUserForm/",
        element: <ConfirmedUserForm />,
      },
      {
        path: "homepage/confirmUserList/confirmedUserForm/:id",
        element: <ConfirmedUserForm />,
      },
      {
        path: "homepage/manageUsers",
        element: <ManageUsers />,
      },

      {
        path: "homepage/manageUsers/userWeeklyScheduleForm/:id",
        element: <UserWeeklyScheduleFormCustom />,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:dId/userTimeLogForm",
        element: <UserTimeLogForm />,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/userScheduleForm/:uidSchedule",
        element: <UserScheduleForm />,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/eventForm/:eId",
        element: <EventForm />,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/eventOptions",
        element: <EventOptions></EventOptions>,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/eventOptions/userScheduleForm",
        element: <UserScheduleForm />,
      },

      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/eventOptions/eventForm",
        element: <EventForm></EventForm>,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/eventOptions/eventForm/:all",
        element: <EventForm></EventForm>,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/eventForm/:eId",
        element: <EventForm />,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/userFinalTimelogForm",
        element: <UserFinalTimelogForm />,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/wageForm",
        element: <UserWageForm />,
      },
      {
        path: "homepage/manageUsers/userSchedule/:id/:uid/wageForm/:wId",
        element: <UserWageForm />,
      },
    ],
  },
  {
    path: "homepage/manageUsers/userSchedule/:id/:dId",
    element: (
      <UserScheduleProvider>
        <UserSchedule />
      </UserScheduleProvider>
    ),
  },

  {
    path: "homepage/login",
    element: <Login />,
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});
export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        <GlobalProvider>
          <RouterProvider router={router}></RouterProvider>
        </GlobalProvider>
      </QueryClientProvider>
      <Toaster
        position="top-center"
        reverseOrder={true}
        toastOptions={{ duration: 1000 }}
      ></Toaster>
    </>
  );
}
