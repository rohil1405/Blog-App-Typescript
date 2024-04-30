const loaderMain = document.getElementById('loader') as HTMLDivElement;
const data = document.getElementById('data') as HTMLDivElement;


async function onePost(postId: string): Promise<Post> {
    const res = await fetch(`https://dummyjson.com/posts/${postId}`);
    const postData = await res.json();
    return postData;
}

async function infoPost(posts?: Post[]): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    const postId: string | null = urlParams.get('id');
    console.log(postId);

    try {
        if (postId === null) {
            console.error('Post ID is not found');
            return;
        } else {
            const post = await onePost(postId);
            data.innerHTML += `
            <div id='header'>
                <div id='main'>
                    <h1>${post.id}</h1>
                    <h2>${post.title}</h2>
                </div>
                <hr>
                <p id='body'>${post.body}</p>
                <p><strong>Tags: </strong>#${post.tags.join(', #')}</p>
                <p><strong>Reactions: </strong>${post.reactions}</p>
                <p><strong>UserId: </strong>${post.userId}</p>
                <button id='home' onclick='goback()'>GoBack</button>
            </div>
            `;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loaderMain.style.display = 'none';
    }
}

function goback(): void {
    location.href = 'index.html';
}

infoPost();
