import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";

import Input from "../Input/Input";
import { basicAlert } from "../Alert";
import { useAuth } from "../../context/AuthContext";
import "./RegisterForm.scss";

const RegisterForm = ({ from }) => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "123123",
    repeatPassword: "123123",
    username: "lalala",
  });

  const changeForm = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.username ||
      !inputs.password
    ) {
      return basicAlert("Todos los campos son obligatorios", "error");
    }
    if (inputs.password !== inputs.repeatPassword) {
      return basicAlert("Las contraseñas deben ser iguales", "error");
    }
    setLoading(true);
    try {
      await signup(inputs);
      navigate(from, { replace: true });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      basicAlert(error.code, "error");
    }
  };

  return (
    <form onChange={changeForm} onSubmit={handleSubmit}>
      <h2 className="title">Registrate</h2>
      <Input
        icon={faEnvelope}
        name="email"
        type="email"
        placeholder="Correo electronico"
      />
      <Input icon={faUser} name="username" placeholder="Nombre de usuario" />
      <Input
        icon={faLock}
        name="password"
        type="password"
        placeholder="Contraseña"
      />
      <Input
        icon={faLock}
        name="repeatPassword"
        type="password"
        placeholder="Repetir contraseña"
      />
      <input
        type="submit"
        value="Registrar"
        disabled={loading}
        className="btn"
      />
    </form>
  );
};

export default RegisterForm;
