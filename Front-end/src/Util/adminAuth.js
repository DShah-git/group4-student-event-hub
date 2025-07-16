export function isAdminAuthenticated() {
  const token = localStorage.getItem("admin_token");
  if (!token) return false;
  return true;
}

export function getAdminUserNameFromToken() {
  const token = localStorage.getItem("admin_token");
  if (!token) return null;
  try {
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userName || payload.name || payload.username || null;
  } catch (e) {
    return null;
  }
}


export function getAdminUserIdfromToken() {
  const token = localStorage.getItem("admin_token");
  
  if (!token) return null;
  try {
   
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId
  } catch (e) {
    return null;
  }
}


export function adminLogout() {
  localStorage.removeItem("admin_token");
  window.location.reload(); 
}

export function adminLogin(token) {
  localStorage.setItem("admin_token", token);
 window.location.href = "/admin/home"; 
}

export function getAdminToken() {
  return localStorage.getItem("admin_token");
}