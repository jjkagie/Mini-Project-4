import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
const url = "http://localhost:5000/";


function Edit(props) {
    const location = useLocation();

    const { blog_id, title, body } = location.state || {};

    const [ newPost, setPost ] = useState({
        newTitle: title,
        newBody: body,
        newTag: "",
        id: blog_id
    });

    const navigate = useNavigate();

    function handleChange(event){
        const inputName = event.target.name;
        const newValue = event.target.value;

        setPost((prevValue) => {
            switch (inputName){
                case "title":
                    return {
                        newTitle: newValue,
                        newBody: prevValue.newBody,
                        newTag: prevValue.newTag,
                        id: prevValue.id
                    };
                case "content":
                    return {
                        newTitle: prevValue.newTitle,
                        newBody: newValue,
                        newTag: prevValue.newTag,
                        id: prevValue.id
                    };
                case "tag":
                    return {
                        newTitle: prevValue.newTitle,
                        newBody: prevValue.newBody,
                        newTag: newValue,
                        id: prevValue.id
                    };
            }
        });
    }

    const editPost = async (event) => {
        event.preventDefault();

        const response = await axios.post(url, newPost);

        navigate("/");
    };

  return (
    <div>
        <h1>Edit Blog Post</h1>
        <form onSubmit={editPost}>
            <table>
                <tbody>
                    <tr>
                        <td><label htmlFor="title">Post Title:</label></td>
                        <td><input onChange={handleChange} type="text" id="title" name="title" value={newPost.newTitle} /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="content">Content:</label></td>
                        <td><input onChange={handleChange} type="text" id="content" name="content" value={newPost.newBody} /></td>
                    </tr>
                    <tr>
                        <td><select onChange={handleChange} name="tag">
                            <option value="default">Select A Tag</option>
                            <option value="Tech">Tech</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Education">Education</option>
                        </select></td>
                        <td><button type="submit" name="btnEdit" value={blog_id}>Edit Post</button></td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
  )
}

export default Edit