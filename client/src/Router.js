import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AdminRoute from "./Pages/AdminRoute.js";
import ProtectedRoute from "./Pages/ProtectedRoute.js";

//Landing page
import LandingPage from "./Pages/LandingPage.js";
// Admin pages
import Admin from "./Pages/Admin.js";
import AdminAddUser from "./Pages/AdminAddUser.js";
import AdminEditUser from "./Pages/AdminEditUser.js";
import AdminManageUsers from "./Pages/AdminManageUsers.js";
import AdminManageTags from "./Pages/AdminManageTags.js";
// Common pages
import Login from "./Pages/Login.js";
import Home from "./Pages/Home.js";
import Calendar from "./Pages/Calendar.js";
import Clients from "./Pages/Clients.js";

class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={LandingPage}></Route>
                    <Route path="/login" exact component={Login}></Route>
                    <ProtectedRoute
                        path="/home"
                        exact
                        component={Home}
                    ></ProtectedRoute>
                    <AdminRoute
                        path="/admin"
                        exact
                        component={Admin}
                    ></AdminRoute>
                    <AdminRoute
                        path="/admin/users"
                        exact
                        component={AdminManageUsers}
                    ></AdminRoute>
                    <AdminRoute
                        path="/admin/users/create"
                        exact
                        component={AdminAddUser}
                    ></AdminRoute>
                    <AdminRoute
                        path="/admin/users/:userID/edit"
                        exact
                        component={AdminEditUser}
                    ></AdminRoute>
                    <AdminRoute
                        path="/admin/tags"
                        exact
                        component={AdminManageTags}
                    ></AdminRoute>
                    <ProtectedRoute
                        path="/calendar"
                        exact
                        component={Calendar}
                    ></ProtectedRoute>
                    <ProtectedRoute
                        path="/clients"
                        exact
                        component={Clients}
                    ></ProtectedRoute>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
