import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Input.scss";

const Input = (props) => {
  const { icon, name, type = "text", placeholder = "" } = props;
  return (
    <div className="input-field">
      <FontAwesomeIcon icon={icon} />
      <input type={type} placeholder={placeholder} name={name} />
    </div>
  );
};

export default Input;
