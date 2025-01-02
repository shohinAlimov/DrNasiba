import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <nav className="navigation">
            <ul className="navigation__list">
              <li className="navigation__item">
                <NavLink to="/" className={({ isActive }) => isActive ? "navigation__link--active" : "navigation__link"}>
                  Домой
                </NavLink>
              </li>
              <li className="navigation__item">
                <NavLink to="/Appointments" className={({ isActive }) => isActive ? "navigation__link--active" : "navigation__link"}>
                  Запись
                </NavLink>
              </li>
              <li className="navigation__item">
                <NavLink to="/About" className={({ isActive }) => isActive ? "navigation__link--active" : "navigation__link"}>
                  О нас
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="header__inner">
            {isLoggedIn ? (
              <NavLink to="/Account" className={({ isActive }) => isActive ? "navigation__link--active" : "navigation__link"}>
                Аккаунт
              </NavLink>
            ) : (
              <>
                <NavLink to="/Login" className={({ isActive }) => isActive ? "header__link--active" : "header__link"}>
                  Логин
                </NavLink>
                <span className="header__divider">/</span>
                <NavLink to="/Register" className={({ isActive }) => isActive ? "header__link--active" : "header__link"}>
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
