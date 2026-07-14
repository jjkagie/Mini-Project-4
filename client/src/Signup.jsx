import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const url = "http://localhost:5000/"

function Signup() {
    const [userData, setUserData] = useState({
        user_id: "",
        password: "",
        username: ""
    });

    function handleChange(event){
        const inputName = event.target.name;
        const newValue = event.target.value;

        setUserData((prevValue) => {
            switch(inputName){
                case "user_id":
                    return {
                        user_id: newValue,
                        password: prevValue.password,
                        username: prevValue.username
                    }
                    break;
                case "password":
                    return {
                        user_id: prevValue.user_id,
                        password: newValue,
                        username: prevValue.username
                    }
                    break;
                case "username":
                    return {
                        user_id: prevValue.user_id,
                        password: prevValue.password,
                        username: newValue
                    }
                    break;
            }
        });
    }

    const submitUser = async (event) => {
        event.preventDefault();

        const response = await axios.post(url+"signup", userData);
    }

  return (
    <div>
        <h1>Sign Up For An Account</h1>
        <form onSubmit={submitUser}>
            <input className="signupForm" name="username" onChange={handleChange} type="text" placeholder="Display Name" /><br />
            <input className="signupForm" name="user_id" onChange={handleChange} type="text" placeholder="Username" /><br />
            <input className="signupForm" name="password" onChange={handleChange} type="password" placeholder="Password" /><br />
            <input className="signupForm" type="submit" value="Sign Up" />
        </form>
        <Link to="/login">Already Have An Account?</Link>
    </div>
  )
}

export default Signup;