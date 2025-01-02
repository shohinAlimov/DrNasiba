import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../../backend/services/api";
import { FormField } from "../ui/FormField";
import { Button } from "../ui/Button";
import { useAuth } from "../context/AuthContext";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post("/api/login", {
        email: data.email,
        password: data.password,
      });
      const token = response.data.token;
      localStorage.setItem("authToken", token); // Save the token
      login(); // Update context
      navigate("/account"); // Redirect to Account page
    } catch (error: any) {
      // Set error under the password field
      if (error.response?.status === 401) {
        setError("password", { type: "manual", message: "Неправильный пароль или email." });
      } else {
        setError("password", { type: "manual", message: "Произошла ошибка. Попробуйте снова." });
      }
    }
  };

  return (
    <section className="login">
      <div className="container">
        <div className="login__wrapper">
          <h2 className="login__title">Логин</h2>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Email">
              <input
                type="email"
                {...register("email", {
                  required: "Введите ваш email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Введите корректный email адрес",
                  },
                })}
              />
              {errors.email && <span className="form__error">{errors.email.message}</span>}
            </FormField>
            <FormField label="Пароль">
              <input
                type="password"
                {...register("password", {
                  required: "Введите ваш пароль",
                })}
              />
              {errors.password && <span className="form__error">{errors.password.message}</span>}
            </FormField>
            <Button type="submit" title="Войти" variant="primary" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;