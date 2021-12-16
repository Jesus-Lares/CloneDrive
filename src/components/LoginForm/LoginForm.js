import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";
import { basicAlert } from "../Alert";
import Input from "../Input/Input";

import "./LoginForm.scss";

const LoginForm = ({ from }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const changeForm = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password) {
      return basicAlert("Todos los campos son obligatorios", "error");
    }
    setLoading(true);
    try {
      await login(inputs, from);
      setLoading(false);
      navigate(from, { replace: true });
    } catch (error) {
      setLoading(false);
      basicAlert(error.code, "error");
    }
  };
  return (
    <form onChange={changeForm} onSubmit={handleSubmit}>
      <h2 className="title">Ingresa</h2>
      <Input
        icon={faEnvelope}
        name="email"
        type="email"
        placeholder="Correo electronico"
      />
      <Input
        icon={faLock}
        name="password"
        type="password"
        placeholder="Contraseña"
      />
      <input
        type="submit"
        value="Ingresar"
        className="btn"
        disabled={loading}
      />
    </form>
  );
};

export default LoginForm;
