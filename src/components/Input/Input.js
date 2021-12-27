import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Input.scss";

const Input = (props) => {
  const { icon, name, type = "text", placeholder = "", value = "" } = props;
  return (
    <div className="input-field">
      <FontAwesomeIcon icon={icon} />
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
};

export default Input;
