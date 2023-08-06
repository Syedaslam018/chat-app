const message = document.getElementById("message-input");
const  chatBox = document.getElementById("chat-box");
const button = document.getElementById('send-button');

button.addEventListener('click', sendFunc);

async function sendFunc(){
    const obj = {
        message: message.value
    }
    const token = localStorage.getItem('token');
    const post = await axios.post('http://localhost:3000/app', obj, {headers:{'Authorization':token}})
    console.log(post.data.message);
}