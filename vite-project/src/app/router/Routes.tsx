import { createBrowserRouter } from "react-router";
import App from "../layouts/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404</div>,
    children: [
      {path: "", element: <HomePage />},
      {path: "activities", element: <ActivityDashboard />},
      {path: "activities/:id", element: <ActivityDetails />},
      {path: "createActivity", element: <ActivityForm key='create'/>},
      {path: "manage/:id", element: <ActivityForm />},
    ]
  }
])