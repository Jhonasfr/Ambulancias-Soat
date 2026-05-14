/** Decode a JWT payload without any external library. */
function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // Pad base64url string and decode
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    const data = JSON.parse(user);
    return data.access ?? null;
  } catch {
    return null;
  }
};

export const getUser = (): Record<string, any> | null => {
  const token = getToken();
  if (!token) return null;
  return decodeJwt(token);
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  const decoded = decodeJwt(token);
  if (!decoded) return false;
  // Check expiry (exp is in seconds)
  if (decoded["exp"] && decoded["exp"] * 1000 < Date.now()) {
    localStorage.removeItem("user");
    return false;
  }
  return true;
};

export const getUserRole = (): number => {
  if (typeof window === "undefined") return 0;
  const user = localStorage.getItem("user");
  if (!user) return 0;
  try {
    const data = JSON.parse(user);
    const raw = data.is_staff ?? data.is_admin;
    if (typeof raw === "boolean") return raw ? 1 : 0;
    const num = Number(raw);
    return Number.isNaN(num) ? 0 : num;
  } catch {
    return 0;
  }
};

export const isSuperAdmin = (): boolean => getUserRole() === 4;

export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === 1 || role === 4;
};

export const getUserId = (): number | null => {
  const user = getUser();
  if (!user) return null;
  return (user["user_id"] as number) || (user["id"] as number) || null;
};
