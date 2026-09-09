import { path } from "../../../router/Path";

export const navItems = [
    {
        title : "New Entry",
        path : path.newEntry,
    },
    {
        title : "Daily Entry",
        path : path.dailyEntry,
    },
    {
        title : "Customer Details",
        path : path.customerDetails
    },
    {
        title : "Add Emi",
        path : path.addEmi
    },
    {
        title : "Reports",
        path : path.reports
    },
    {
        title : "Add Agent",
        path : path.agentRegister,
        superAdminOnly : true
    },
    {
        title : "Change Password",
        path : path.changePassword
    },
    {
        title : "Logout",
        path : path.logOut
    },
]