import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import BlogPostForm from './BlogPostForm'
import PostList from './PostList'
const url = "http://localhost:5000/"

function Home() {
    const navigate = useNavigate();
    //const [user, setUser] = useState("");
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState({
        title: "",
        body: "",
        tag: ""
    });
    const [btnID, setBtnID] = useState("");

    
    const toLogin = () => {
        navigate("/login");
    }
    

    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get(url);
            
            if( typeof response.data.err !== 'undefined' ){
                toLogin();
            }

            setPosts(response.data.posts);
        }

        getUser();
    }, []);
    
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

    function handleBtnIdChange(event){
        setBtnID(event.target.value);
    }

    const createPost = async (event) => {
        event.preventDefault();
        
        const response1 = await axios.post(url+"create", post);

        const response2 = await axios.get(url);
        setPosts(response2.data.posts);
        
    }

    const editPost = async (event) => {
        event.preventDefault();

        const post = posts.filter((element) => {
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
        setPosts(response2.data.posts);
    }
  
    return (
    <div>
        <h1>Awesome Blog</h1>
        <BlogPostForm posts={posts} setPosts={setPosts}/>
        {/* 
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
        */}
        <PostList posts={posts} setPosts={setPosts}/>
        {/* 
        <div className="table-container">
        {posts.map((post) => (
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
        */}
    </div>
  )
}

export default Home