import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layouts/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
export const routes: RouteObject[] = [
    {
        path: "/", 
        element:<App />,
        children: [
            {path: "/activities", element:<ActivityDashboard/>},
            {path: "/createActivity", element:<ActivityForm key='create'/>},
            {path: "/editActivity/:id", element:<ActivityForm key='edit'/>},
            {path: "/activities/:id", element:<ActivityDetails/>},
            {path: "errors", element: <TestErrors/>},
            {path: "not-found", element: <NotFound/>},
            {path: "server-error", element: <ServerError/>},
            {path: "*", element:  <Navigate replace to='/not-found'/>}
        ]
    },
]

export const router = createBrowserRouter(routes)