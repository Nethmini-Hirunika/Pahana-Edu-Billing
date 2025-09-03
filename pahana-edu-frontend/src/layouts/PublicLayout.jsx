import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function onLogout(){
    await logout();
    nav("/", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto p-4 flex gap-6">
          <Link to="/" className="font-bold">Pahana Edu</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/help">Help</Link>

          <div className="ml-auto flex gap-4">
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                {user.role === "ADMIN" ? <Link to="/admin">Admin</Link> : <Link to="/account">My Account</Link>}
                {user && <span className="text-xs opacity-70">({user.role})</span>}

                <button onClick={onLogout} className="underline">Logout</button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="max-w-6xl mx-auto p-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Pahana Edu
        </div>
      </footer>
    </div>
  );
}
