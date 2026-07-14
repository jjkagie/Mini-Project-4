import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
const url = "https://mini-project-4-backend.onrender.com/"

function BlogPostForm(props){
    const [user, setUser] = useState("");
    const [post, setPost] = useState({
            title: "",
            body: "",
            tag: ""
    });

    function handlePostChange(event){
        const inputName = event.target.name;
        const newValue = event.target.value;

        setPost((prevValue) => {
            switch (inputName){
                case "title":
                    return {
                        title: newValue,
                        body: prevValue.body,
                        tag: prevValue.tag
                    };
                case "content":
                    return {
                        title: prevValue.title,
                        body: newValue,
                        tag: prevValue.tag
                    };
                case "tag":
                    return {
                        title: prevValue.title,
                        body: prevValue.body,
                        tag: newValue
                    };
            }
        });
    }

    const createPost = async (event) => {
        event.preventDefault();
        
        const response1 = await axios.post(url+"create", post);

        const response2 = await axios.get(url);
        props.setPosts(response2.data.posts);
    }

    return (
        <div id="create form">
            <form onSubmit={createPost}>
            <table>
                <tbody>
                    <tr>
                        <td><label htmlFor="title">Post Title:</label></td>
                        <td><input onChange={handlePostChange} type="text" id="title" name="title" /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="content">Content:</label></td>
                        <td><input onChange={handlePostChange} type="text" id="content" name="content" /></td>
                    </tr>
                    <tr>
                        <td><select onChange={handlePostChange} name="tag">
                            <option value="default">Select A Tag</option>
                            <option value="Tech">Tech</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Education">Education</option>
                        </select></td>
                        <td><input type="submit" value="Create" /></td>
                    </tr>
                </tbody>
            </table>
            </form>
        </div>
    );
}

export default BlogPostForm;