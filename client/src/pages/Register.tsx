import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../../backend/services/api";
import { FormField } from "../ui/FormField";
import { Button } from "../ui/Button";
import { useAuth } from "../context/AuthContext";

interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();
  const password = watch("password");
  const { login } = useAuth(); // Move useAuth call here

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const response = await api.post("/api/register", {
        email: data.email,
        password: data.password,
      });
      const token = response.data.token; // Assuming the server sends back a token
      localStorage.setItem("authToken", token); // Save the token
      login(); // Update context
      navigate("/account"); // Redirect to account page
    } catch (error: any) {
      alert(error.response?.data?.error || "Ошибка при регистрации!");
    }
  };

  return (
    <section className="register">
      <div className="container">
        <div className="register__wrapper">
          <h2 className="register__title">Регистрация</h2>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Email">
              <input
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
                  minLength: {
                    value: 8,
                    message: "Пароль должен содержать не менее 8 символов",
                  },
                })}
              />
              {errors.password && <span className="form__error">{errors.password.message}</span>}
            </FormField>
            <FormField label="Подтвердите пароль">
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Подтвердите ваш пароль",
                  validate: (value) => value === password || "Пароли не совпадают",
                })}
              />
              {errors.confirmPassword && <span className="form__error">{errors.confirmPassword.message}</span>}
            </FormField>
            <Button type="submit" title="Регистрация" variant="primary" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
