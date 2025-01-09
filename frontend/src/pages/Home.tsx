import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { user, isLoggedIn } = useAuth();

  return (
    <>
      <section className="greetings">
        <div className="container">
          <h1>Привет {user?.name || "Гость"}!</h1>

          {!isLoggedIn ? (
            <h2>Хотите записаться на консультацию? Просим вас <Link className="greetings__redirect" to={"/register"}>зарегистрироваться</Link></h2>
          ) : (
            <>
            </>
          )}
        </div>
      </section>

    </>
  );
};

export default Home;
