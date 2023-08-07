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

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token')
    const data = await axios.get("http://localhost:3000/getchat", {headers:{'Authorization':token}});
    console.log(data.data.data);
    const arrayOfData = data.data.data;
    for(let i=0; i<arrayOfData.length; i++){
        displayData(arrayOfData[i]);
    }
})

function displayData(obj){
    let p = document.createElement('p')
    p.innerHTML = `${obj.name}: ${obj.text}`
    chatBox.appendChild(p);
}

setInterval(async() => {
    const token = localStorage.getItem('token')
    const data = await axios.get("http://localhost:3000/getchat", {headers:{'Authorization':token}});
    console.log(data.data.data);
    const arrayOfData = data.data.data;
    chatBox.innerHTML='';
    for(let i=0; i<arrayOfData.length; i++){
        displayData(arrayOfData[i]);
    }
},1000)