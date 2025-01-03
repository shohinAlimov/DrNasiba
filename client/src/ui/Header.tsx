import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export const Header = () => {
  const { user, isLoggedIn } = useAuth(); // Use isLoggedIn to manage state

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <nav className="navigation">
            <ul className="navigation__list">
              <li className="navigation__item">
                <NavLink to="/" className="navigation__link">Home</NavLink>
              </li>
              <li className="navigation__item">
                <NavLink to="/appointments" className="navigation__link">Appointments</NavLink>
              </li>
              <li className="navigation__item">
                <NavLink to="/about" className="navigation__link">About</NavLink>
              </li>
            </ul>
          </nav>
          <div className="header__inner">
            {isLoggedIn ? (
              <>
                {user?.logo && (
                  <NavLink to="/account">
                    <img src={user.logo} alt="User Logo" className="header__account-logo" />
                  </NavLink>
                )}
                <NavLink to="/account" className="navigation__link">
                  {user?.name || "Account"}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="navigation__link">Login</NavLink>
                <NavLink to="/register" className="navigation__link">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
