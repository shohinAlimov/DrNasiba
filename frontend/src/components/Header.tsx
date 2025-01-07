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
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                >
                  Главная
                </NavLink>
              </li>
              {isLoggedIn ? (
                <li className="navigation__item">
                  <NavLink
                    to="/appointments"
                    className={({ isActive }) =>
                      isActive ? "navigation__link navigation__link--active" : "navigation__link"
                    }
                  >
                    Консультация
                  </NavLink>
                </li>
              ) : (
                <></>
              )}

              <li className="navigation__item">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                >
                  Мой опыт
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="header__inner">
            {isLoggedIn ? (
              <>
                {user?.logo && (
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      isActive ? "navigation__link navigation__link--active" : "navigation__link"
                    }
                  >
                    <img src={`http://localhost:5000${user.logo}`} alt="User Logo" className="header__account-logo" />
                  </NavLink>
                )}
                <NavLink to="/account"
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                >
                  {user?.name || "Мой аккаунт"}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                >Вход</NavLink>
                <span className="header__divider"> / </span>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                >
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
