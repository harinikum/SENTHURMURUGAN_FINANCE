import React from "react";
import Login from "../screen/LoginPage/Login";
import { path } from "./Path";
import { Route, Routes } from "react-router-dom";
import PrivateLayout from "../common/layout/Private/PrivateLayout";
import PublicLayout from "../common/layout/Public/PublicLayout";
import DailyEntry from "../screen/DailyEntry/DailyEntry";
import SummaryEntry from "../screen/SummaryEntry/SummaryEntry";
import CustomerDetails from "../screen/CustomerDetails/CustomerDetails";
import Reports from "../screen/Reports/Reports";
import ChangePassword from "../screen/ChangePassword.jsx/ChangePassword";
import LogOut from "../screen/Logout/LogOut";
import AgentRegister from "../screen/AgentRegister/AgentRegister";
import NormalProtect from "./ProtectedRoutes/NormalProtect";
import SuperAdminProtect from "./ProtectedRoutes/SuperAdminProtect";
import CustomerTrashDetails from "../components/CustomerDetails/Trash/CustomerTrashDetails";
import NewEntry from "../components/NewEntry/NewEntry";
import AddEmi from "../screen/AddEmi/AddEmi";
import ForgetPasswordPage from "../screen/LoginPage/ForgetPasswordPage";

const RouterComp = () => {
  const publicRoutes = [
    {
      Component: Login,
      path: path.login,
    },
    {
      Component: ForgetPasswordPage,
      path: path.forgetPassword,
    },
  ];

  const superAdminRoutes = [
    {
      Component: SummaryEntry,
      path: path.summaryEntry,
    },
  ];

  const privateRoutes = [
    {
      Component: DailyEntry,
      path: path.dailyEntry,
    },
    {
      Component: NewEntry,
      path: path.newEntry,
    },
    {
      Component: CustomerDetails,
      path: path.customerDetails,
    },
    {
      Component: AddEmi,
      path: path.addEmi,
    },
    {
      Component: Reports,
      path: path.reports,
    },
    {
      Component: CustomerTrashDetails,
      path: path.trashMembers,
    },
    {
      Component: ChangePassword,
      path: path.changePassword,
    },
    {
      Component: LogOut,
      path: path.logOut,
    },
    {
      Component: AgentRegister,
      path: path.agentRegister,
    },
  ];
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {publicRoutes.map(({ Component, path }, ind) => (
          <Route key={ind} path={path} element={<Component />} />
        ))}
      </Route>
      <Route element={<PrivateLayout />}>
        <Route element={<NormalProtect />}>
          {privateRoutes.map(({ Component, path }, ind) => (
            <Route key={ind} path={path} element={<Component />} />
          ))}
        </Route>
        <Route element={<NormalProtect />}>
          <Route element={<SuperAdminProtect />}>
            {superAdminRoutes.map(({ Component, path }, ind) => (
              <Route key={ind} path={path} element={<Component />} />
            ))}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default RouterComp;