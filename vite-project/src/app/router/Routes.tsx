import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layouts/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
export const routes: RouteObject[] = [
    {
        path: "/", 
        element:<App />,
        children: [
            {path: "/activities", element:<ActivityDashboard/>},
            {path: "/createActivity", element:<ActivityForm key='create'/>},
            {path: "/editActivity/:id", element:<ActivityForm key='edit'/>},
            {path: "/activities/:id", element:<ActivityDetails/>},
        ]
    },
]

export const router = createBrowserRouter(routes)