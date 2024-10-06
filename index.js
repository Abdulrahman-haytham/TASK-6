const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());


function getPosts() {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
}


function savePosts(posts) {
    fs.writeFileSync('data.json', JSON.stringify(posts, null, 2));
}


app.get('/posts', (req, res) => {
    const posts = getPosts();
    res.json(posts);
});


app.post('/posts', (req, res) => {
    const posts = getPosts();
    const newPost = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        date: new Date().toISOString(),
    };
    posts.push(newPost);
    savePosts(posts);
    res.status(201).json(newPost);
});


app.put('/posts/:id', (req, res) => {
    const posts = getPosts(); 
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId); 
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' }); 
    }

    if (req.body.title) {
        posts[postIndex].title = req.body.title;
    }

    if (req.body.description) {
        posts[postIndex].description = req.body.description;
    }

    if (req.body.author) {
        posts[postIndex].author = req.body.author;
    }

   
    posts[postIndex].date = new Date().toISOString();

    
    savePosts(posts);

    
    res.json(posts[postIndex]);
});


app.delete('/posts/:id', (req, res) => {
    const posts = getPosts();
    const postId = parseInt(req.params.id);
    const updatedPosts = posts.filter(post => post.id !== postId);

    if (posts.length === updatedPosts.length) {
        return res.status(404).json({ message: 'Post not found' });
    }

    savePosts(updatedPosts);
    res.json({ message: 'Post deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 

