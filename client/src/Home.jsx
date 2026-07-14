import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import BlogPostForm from './BlogPostForm'
import PostList from './PostList'
const url = "https://mini-project-4-backend.onrender.com:5000/"

function Home() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    
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
      
    return (
    <div>
        <h1>Awesome Blog</h1>
        <BlogPostForm posts={posts} setPosts={setPosts}/>
        <PostList posts={posts} setPosts={setPosts}/>
    </div>
  )
}

export default Home