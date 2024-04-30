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
const loaderMain = document.getElementById('loader');
const data = document.getElementById('data');
function onePost(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://dummyjson.com/posts/${postId}`);
        const postData = yield res.json();
        return postData;
    });
}
function infoPost(posts) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        const postId = urlParams.get('id');
        console.log(postId);
        try {
            if (postId === null) {
                console.error('Post ID is not found');
                return;
            }
            else {
                const post = yield onePost(postId);
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
        }
        catch (error) {
            console.error(error);
        }
        finally {
            loaderMain.style.display = 'none';
        }
    });
}
function goback() {
    location.href = 'index.html';
}
infoPost();
