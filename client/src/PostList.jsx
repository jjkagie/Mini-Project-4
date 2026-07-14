import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
const url = "http://localhost:5000/"

function PostList(props){
    const [btnID, setBtnID] = useState("");

    const navigate = useNavigate();


    function handleBtnIdChange(event){
        setBtnID(event.target.value);
    }

    const editPost = async (event) => {
        event.preventDefault();

        const post = props.posts.filter((element) => {
            return element.blog_id == btnID;
        })[0];

        const response = await axios.post(url+"edit", {blog_id: post.blog_id});

        if( response.data.success ){
            navigate("/edit", {state: {
                blog_id: post.blog_id,
                title: post.title,
                body: post.body
            }});
        }

        //const response1 = await axios.post();
    }

    const delPost = async (event) => {
        event.preventDefault();
        
        const response1 = await axios.post(url+"delete", {btnDel: btnID});
    
        const response2 = await axios.get(url);
        props.setPosts(response2.data.posts);
    }

    return (
        <div className="table-container">
        {props.posts.map((post) => (
            <table className="posts" key={post.blog_id}>
                <tbody>
                <tr>
                    <td className="post">
                        <p className="name">{post.creator_name} posted:</p>
                        <p className="title">{post.title}</p>
                    </td>
                </tr>
                <tr>
                    <td className="post" colSpan="2"><p className="content">{post.body}</p></td>
                </tr>
                <tr>
                    <td className="post" colSpan="2"><p className="time">{post.date_created}</p></td>
                </tr>
                    <tr>
                        <td className="post">
                            <form onSubmit={editPost}>
                                <button onClick={handleBtnIdChange} type="submit" name="btnEdit" value={post.blog_id}>Edit Post</button>
                            </form>
                            <form onSubmit={delPost}>
                                <button onClick={handleBtnIdChange} type="submit" name="btnDel" value={post.blog_id}>Delete Post</button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        ))}
        </div>
    );
}


export default PostList;