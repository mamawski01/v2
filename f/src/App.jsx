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
    ],
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
