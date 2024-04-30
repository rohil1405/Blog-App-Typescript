"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const limit = document.getElementById('limit');
const filter = document.getElementById('filter');
const main = document.getElementById('data');
const loader = document.getElementById('loader');
const search = document.getElementById('search');
const addUser = document.getElementById('addUser');
const add = document.getElementById('add');
const addValue = document.getElementById('addValue');
const editForm = document.getElementById('editForm');
const update = document.getElementById('update');
editForm.style.display = 'none';
const postApi = "https://dummyjson.com/posts";
function fetchData() {
    return __awaiter(this, arguments, void 0, function* (api = postApi) {
        const limitValue = limit.value;
        if (limitValue !== ' ') {
            api = `https://dummyjson.com/posts?limit=${limitValue}`;
        }
        else {
            api = postApi;
        }
        const response = yield fetch(api);
        const data = yield response.json();
        return data;
    });
}
function getPost() {
    return __awaiter(this, arguments, void 0, function* (api = postApi, searchData = null) {
        try {
            const response = yield fetchData(api);
            let orderby;
            let filterData = filter.value.trim();
            if (filterData === 'DESC') {
                orderby = response.posts.reverse();
            }
            else {
                orderby = response.posts;
            }
            if (searchData != null) {
                orderby = searchData;
            }
            if (typeof orderby === 'object') {
                main.innerHTML = '';
                orderby.forEach((post) => {
                    main.innerHTML +=
                        `<div id="box">
                        <div id='complete' onclick='showPost(${post.id})'>
                            <p id='postId'><strong>${post.id}</strong></p>
                            <hr>
                            <p id='content'><strong>${post.title}</strong></p> 
                            <hr>
                            <p id='body'>${post.body}</p>
                            <hr>
                            <p id='tag'><strong>${post.tags.join(', ')}</strong></p>    
                        </div>
                        <div id='buttons'>
                            <button id='edit' onclick='editPost(${post.id})'>Edit</button>
                            <button id='remove' onclick='removePost(${post.id})'>Remove</button>
                        </div><br>
                    </div>`;
                });
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            loader.style.display = 'none';
        }
    });
}
getPost();
search.addEventListener('input', searchPost);
function searchPost() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield fetchData(postApi);
            let filterData = result.posts.filter(ele => ele.title.toLowerCase().includes(search.value.toLowerCase()));
            getPost(postApi, filterData);
            ;
        }
        catch (error) {
            console.error(error);
        }
        finally {
            loader.style.display = 'block';
        }
    });
}
function showPost(postId) {
    window.location.href = `onePost.html?id=${postId}`;
}
add.style.display = `none`;
function displayAdd() {
    add.style.display = `block`;
}
addValue.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    add.style.display = 'none';
    const titleInput = document.querySelector('#addTitle').value;
    const bodyInput = document.querySelector('#addBody').value;
    const tagsInput = document.querySelector('#addTags').value.split(',');
    const userInput = document.querySelector('#addUserId').value;
    const postApi = "https://dummyjson.com/posts/add";
    console.log(titleInput, bodyInput, tagsInput, userInput);
    const postData = {
        title: titleInput,
        body: bodyInput,
        tags: tagsInput,
        userId: userInput,
        reactions: 0
    };
    console.log(postData);
    try {
        const response = yield fetch(postApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        console.log('Response:', response);
        if (response.ok) {
            alert('Post added Successfully');
            console.log('Post added successfully');
            getPost();
        }
        else {
            console.error('Failed to add post');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        editForm.style.display = 'none';
    }
}));
function edit(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        editForm.style.display = 'block';
        const titleInput = editForm.querySelector('#addTitle');
        const bodyInput = editForm.querySelector('#addBody');
        const tagsInput = editForm.querySelector('#addTags');
        const userInput = editForm.querySelector('#addUserId');
        try {
            const response = yield fetch(`https://dummyjson.com/posts/${postId}`);
            const postData = yield response.json();
            let userId = postData.userId.toString();
            let tags = postData.tags.join(',');
            titleInput.value = postData.title;
            bodyInput.value = postData.body;
            tagsInput.value = tags;
            userInput.value = userId;
            postData.title = titleInput.value;
            postData.body = bodyInput.value;
            userId = userInput.value;
            tags = tagsInput.value;
            const updateResponse = yield fetch(`https://dummyjson.com/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            console.log('Response:', updateResponse);
            update.addEventListener('click', function () {
                alert('Post added Successfully');
                console.log('Post added successfully');
                getPost();
                editForm.style.display = 'none';
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
        }
    });
}
function editPost(postId) {
    edit(postId);
}
function remove(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://dummyjson.com/posts/${postId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Delete Post Successfully');
                console.log('Delete Post Successfully');
                getPost();
            }
            else {
                throw new Error('Error');
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            loader.style.display = 'block';
        }
    });
}
function removePost(postId) {
    remove(postId);
}
