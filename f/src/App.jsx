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

const routes = [
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate replace to="homepage" />,
      },

      {
        path: "homepage",
        element: (
          <ProtectedRoutes>
            <Homepage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "homepage/registryUserList",
        element: (
          <ProtectedRoutes>
            <RegistryUserList />
          </ProtectedRoutes>
        ),
      },
      {
        path: "homepage/registryUserList/registryUserForm",
        element: (
          <ProtectedRoutes>
            <RegistryUserForm />
          </ProtectedRoutes>
        ),
      },
      {
        path: "homepage/registryUserList/registryUserForm/:id",
        element: (
          <ProtectedRoutes>
            <RegistryUserForm />
          </ProtectedRoutes>
        ),
      },

      {
        path: "homepage/confirmUserList",
        element: (
          <ProtectedRoutes>
            <ConfirmedUserList />
          </ProtectedRoutes>
        ),
      },
      {
        path: "homepage/confirmUserList/confirmedUserForm/",
        element: (
          <ProtectedRoutes>
            <ConfirmedUserForm />
          </ProtectedRoutes>
        ),
      },
      {
        path: "homepage/confirmUserList/confirmedUserForm/:id",
        element: (
          <ProtectedRoutes>
            <ConfirmedUserForm />
          </ProtectedRoutes>
        ),
      },
      {
        path: "homepage/manageUsers",
        element: (
          <ProtectedRoutes>
            <ManageUsers />
          </ProtectedRoutes>
        ),
      },
    ],
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
        <ReactQueryDevtools initialIsOpen></ReactQueryDevtools>
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
