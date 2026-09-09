export const getCredintials = ()=>{
    let email = localStorage.getItem('user_id');
    let isSuperAdmin = localStorage.getItem('issuperadmin');
    let token = localStorage.getItem('token');

    return {email : email, isSuperAdmin : isSuperAdmin, token : token}
}