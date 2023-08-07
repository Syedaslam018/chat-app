const message = document.getElementById("message-input");
const  chatBox = document.getElementById("chat-box");
const button = document.getElementById('send-button');
localStorage.setItem('arrayOfData', []);
button.addEventListener('click', sendFunc);

async function sendFunc(){
    const obj = {
        message: message.value
    }
    message.value = ''
    const token = localStorage.getItem('token');
    const post = await axios.post('http://localhost:3000/app', obj, {headers:{'Authorization':token}})
    console.log(post.data.message);
}

window.addEventListener("DOMContentLoaded", someFunc)
async function someFunc(){
       await updateLocalStorage();
        const data = JSON.parse(localStorage.getItem('arrayOfData') || "[]");
        //console.log(data)
        for(let i=0; i<data.length; i++){
            displayData(data[i]);
        }
}
function displayData(obj){
    let p = document.createElement('p')
    p.innerHTML = `${obj.name}: ${obj.text}`
    chatBox.appendChild(p);
}

setInterval(async() => {
    await updateLocalStorage()
    const data = JSON.parse(localStorage.getItem('arrayOfData') || "[]");
    //console.log(data)
    chatBox.innerHTML=''
        for(let i=0; i<data.length; i++){
            displayData(data[i]);
        }
},1000)


async function updateLocalStorage(){
    const token = localStorage.getItem('token')
    let oldData = JSON.parse(localStorage.getItem('arrayOfData') || "[]");
    const lastMessageId = (oldData.length === 0)?-1:oldData[oldData.length-1].id;
    const data = await axios.get(`http://localhost:3000/getMessages?lastMessageId=${lastMessageId}`, {headers:{'Authorization':token}})
    let newData = data.data.data
    let mergedData = [...oldData, ...newData]
    localStorage.setItem('arrayOfData', JSON.stringify(mergedData));
}
