import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import RegisterForm from "../../components/RegisterForm/RegisterForm";
import LoginForm from "../../components/LoginForm/LoginForm";

import login from "../../assets/login.svg";
import register from "../../assets/register.svg";
import "./Login.scss";

const Login = () => {
  const [signUp, setSignUp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const init = () => currentUser && navigate(from, { replace: true });

  useEffect(init, []);

  return (
    <div className={`container ${signUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <div className="sign-in-form">
            <LoginForm from={from} />
          </div>
          <div className="sign-up-form">
            <RegisterForm from={from} />
          </div>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>¿Nuevo usuario?</h3>
            <p>
              Con el cloneDrive el almacenamiento en la nube es fácil,
              conveniente y seguro. Crea ya una cuenta gratis.
            </p>
            <button className="btn transparent" onClick={() => setSignUp(true)}>
              Empezar
            </button>
          </div>
          <img src={register} className="image" alt="register" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>¿Ya tienes cuenta?</h3>
            <p>
              Ingresa y podras guarda, comparte y colabora en archivos y
              carpetas desde cualquier dispositivo móvil, tablet u ordenador
            </p>
            <button
              className="btn transparent"
              onClick={() => setSignUp(false)}
            >
              Ingresar
            </button>
          </div>
          <img src={login} className="image" alt="login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
