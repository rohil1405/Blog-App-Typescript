const limit = document.getElementById('limit') as HTMLSelectElement;
const filter = document.getElementById('filter') as HTMLSelectElement;
const main = document.getElementById('data') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;
const search = document.getElementById('search') as HTMLInputElement;
const addUser = document.getElementById('addUser') as HTMLButtonElement;
const add = document.getElementById('add') as HTMLDivElement;
const addValue = document.getElementById('addValue') as HTMLButtonElement;
const editForm = document.getElementById('editForm') as HTMLFormElement;
const update = document.getElementById('update') as HTMLButtonElement;

editForm.style.display = 'none';
interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    userId: number,
    reactions: number
}

const postApi: string = "https://dummyjson.com/posts";

async function fetchData(api: string = postApi): Promise<{ posts: Post[] }> {
    const limitValue: string = limit.value;

    if (limitValue !== ' ') {
        api = `https://dummyjson.com/posts?limit=${limitValue}`;
    } else {
        api = postApi;
    }

    const response = await fetch(api);
    const data = await response.json();
    return data;
}

async function getPost(api: string = postApi, searchData: Post[] | null = null): Promise<void> {
    try {
        const response = await fetchData(api);
        let orderby: Post[];
        let filterData: string = filter.value.trim();

        if (filterData === 'DESC') {
            orderby = response.posts.reverse();
        } else {
            orderby = response.posts;
        }

        if (searchData != null) {
            orderby = searchData;
        }
        if (typeof orderby === 'object') {
            main.innerHTML = '';
            orderby.forEach((post: Post) => {
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
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = 'none';
    }
}

getPost();

search.addEventListener('input', searchPost);
async function searchPost(): Promise<void> {
    try {
        const result = await fetchData(postApi);
        let filterData: Post[] = result.posts.filter(
            ele => ele.title.toLowerCase().includes(search.value.toLowerCase())
        );
        getPost(postApi, filterData);;
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = 'block';
    }
}

function showPost(postId: number): void {
    window.location.href = `onePost.html?id=${postId}`;
}

add.style.display = `none`;
function displayAdd(): void {
    add.style.display = `block`;
}

addValue.addEventListener('click', async ():Promise<void> => {
    add.style.display = 'none';
    const titleInput = (document.querySelector('#addTitle') as HTMLInputElement).value;
    const bodyInput = (document.querySelector('#addBody') as HTMLInputElement).value;
    const tagsInput = (document.querySelector('#addTags') as HTMLInputElement).value.split(',');
    const userInput = (document.querySelector('#addUserId') as HTMLInputElement).value;
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
        const response = await fetch(postApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        console.log('Response:', response);
        if (response.ok) {
            alert('Post added Successfully')
            console.log('Post added successfully');
            getPost();
        } else {
            console.error('Failed to add post');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        editForm.style.display = 'none';
    }
});

async function edit(postId: number): Promise<void> {
    editForm.style.display = 'block';

    const titleInput = editForm.querySelector('#addTitle') as HTMLInputElement;
    const bodyInput = editForm.querySelector('#addBody') as HTMLInputElement;
    const tagsInput = editForm.querySelector('#addTags') as HTMLInputElement;
    const userInput = editForm.querySelector('#addUserId') as HTMLInputElement;

    try {
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        const postData: Post = await response.json();

        let userId: string = postData.userId.toString();
        let tags: string = postData.tags.join(',');

        titleInput.value = postData.title;
        bodyInput.value = postData.body;
        tagsInput.value = tags
        userInput.value = userId;

        postData.title = titleInput.value;
        postData.body = bodyInput.value;
        userId = userInput.value
        tags = tagsInput.value;

        const updateResponse = await fetch(`https://dummyjson.com/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        console.log('Response:', updateResponse);
        update.addEventListener('click', function () {
            alert('Post added Successfully')
            console.log('Post added successfully');
            getPost();
            editForm.style.display = 'none';
        })
    } catch (error) {
        console.error('Error:', error);
    } finally {

    }
}

function editPost(postId: number): void {
    edit(postId);
}

async function remove(postId: number): Promise<void> {
    try {
        const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Delete Post Successfully');
            console.log('Delete Post Successfully')
            getPost();
        } else {
            throw new Error('Error')
        }
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = 'block';
    }
}
function removePost(postId: number): void {
    remove(postId);
}















