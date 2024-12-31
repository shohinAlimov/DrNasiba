import { NavLink } from "react-router-dom";

export const Header = () => {
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
            <NavLink
              className={({ isActive }) =>
                isActive ? "header__link header__link--active" : "header__link"
              }
              to="/Login">Логин</NavLink>
            <span className="header__divider">/</span>
            <NavLink className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
              to="/Registration">Регистрация</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};
