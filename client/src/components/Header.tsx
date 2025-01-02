import { NavLink, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token
    navigate("/login"); // Redirect to the login page
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <nav className="navigation">
            <ul className="navigation__list">
              <li className="navigation__item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                  to="/"
                >
                  Домой
                </NavLink>
              </li>
              <li className="navigation__item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                  to="/Appointments"
                >
                  Запись
                </NavLink>
              </li>
              <li className="navigation__item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "navigation__link navigation__link--active" : "navigation__link"
                  }
                  to="/About"
                >
                  О нас
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="header__inner">
            {isLoggedIn ? (
              <button className="btn header__link" onClick={handleLogout}>
                Выйти
              </button>
            ) : (
              <>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "header__link header__link--active" : "header__link"
                  }
                  to="/Login"
                >
                  Логин
                </NavLink>
                <span className="header__divider">/</span>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "header__link header__link--active" : "header__link"
                  }
                  to="/Register"
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
