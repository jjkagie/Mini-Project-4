import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
const url = "http://localhost:5000/";

function Login() {
    const [loginData, setLoginData] = useState({
        user_id: "",
        password: ""
    });
    const navigate = useNavigate();

    function handleChange(event){
        const inputName = event.target.name;
        const newValue = event.target.value;

        setLoginData((prevValue) => {
            switch( inputName ){
                case "user_id":
                    return {
                        user_id: newValue,
                        password: prevValue.password
                    }
                    break;
                case "password":
                    return {
                        user_id: prevValue.user_id,
                        password: newValue
                    }
                    break;
            }
        });
    }

    const onLogin = async (event) => {
        event.preventDefault();

        const response = await axios.post(url+"login", loginData);
        
        if( response.data.success ){
            navigate("/");
        }
        else{
            alert("Error: Username/Password Was Incorrect!");
        }
    }

  return (
    <div>
        <h1>Log In To An Existing Account</h1>
        <form onSubmit={onLogin}>
            <input className="loginForm" name="user_id" onChange={handleChange} type="text" placeholder="Username" /><br />
            <input className="loginForm" name="password" onChange={handleChange} type="password" placeholder="Password" /><br />
            <input className="loginForm" type="submit" value="Log In" />
        </form>
        <Link to="/signup">Don't Have An Account?</Link>
    </div>
  )
}

export default Login