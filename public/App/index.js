const message = document.getElementById("message-input");
const  chatBox = document.getElementById("chat-box");
const button = document.getElementById('send-button');
const createGroup = document.getElementById('create-group')
const divGroups = document.getElementById('users-list') 


localStorage.setItem('arrayOfData', []);
//events
button.addEventListener('click', sendFunc);
createGroup.addEventListener('click', createGroupFunc);
window.addEventListener("DOMContentLoaded", someFunc)


async function createGroupFunc(){
    const name = prompt('Enter group Name:')
    const token = localStorage.getItem('token')
    const data = await axios.post('http://localhost:3000/createGroup', {name: name}, {headers:{'Authorization':token}})
    console.log(data.data.message);

}

function displayGroups(arr){
    divGroups.innerHTML='';
    for(let i=0; i<arr.length; i++){
        let p = document.createElement('p')
        p.style.cursor= 'pointer';
        p.setAttribute('id', arr[i].id)
        p.innerHTML=arr[i].name;
        let button = document.createElement('button')
        button.innerHTML='+User'
        button.onclick = addButton;
        p.append(button)
        let removeUserbutton = document.createElement('button')
        removeUserbutton.innerHTML='-User'
        removeUserbutton.onclick = removeButton;
        p.append(removeUserbutton)
        let changeAdminButton = document.createElement('button')
        changeAdminButton.innerHTML='Change Admin';
        changeAdminButton.onclick = changeAdmin;
        p.append(changeAdminButton);
        divGroups.append(p);
        p.addEventListener('click', getChat)
    }
}
async function addButton(){
    const email = prompt('enter the email of the user')
    const id = this.parentNode.getAttribute("id")
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3000/addToGroup', {id: id, mail: email}, {headers:{'Authorization':token}})
    console.log(res.data);

}

async function removeButton(){
    const email = prompt('enter the email of the user')
    const id = this.parentNode.getAttribute("id");
    console.log(id);
    const token = localStorage.getItem('token');
    console.log(token)
    const res = await axios.post('http://localhost:3000/removeFromGroup', {id: id, mail:email}, {headers:{'Authorization':token}})
    console.log(res.data);
}

async function changeAdmin(){
    try{
    const email = prompt('enter the email of the admin you want to make')
    const id = this.parentNode.getAttribute("id");
    const token = localStorage.getItem('token')
    const res = await axios.post('http://localhost:3000/changeAdmin', {id: id, mail:email}, {headers:{'Authorization':token}})
    console.log(res.data.message);
    }
    catch(err){
        console.log(err.response.data.message);
    }
}
async function getChat(e){
    e.preventDefault();
    //console.log()
    localStorage.setItem('currentGroupId', e.target.getAttribute('id'));
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:3000/getchat/${e.target.getAttribute('id')}`,{headers:{'Authorization':token}})
    console.log(res.data.data);
    displayData(res.data.data)
}
async function sendFunc(){
    const obj = {
        groupId: localStorage.getItem('currentGroupId'),
        message: message.value
    }
    message.value = ''
    const token = localStorage.getItem('token');
    const post = await axios.post('http://localhost:3000/app', obj, {headers:{'Authorization':token}})
    console.log(post.data.message);
}

async function someFunc(){
    const token = localStorage.getItem('token');
    const groups = await axios.get('http://localhost:3000/getGroups', {headers:{'Authorization':token}})
    await updateLocalStorage();
    const data = JSON.parse(localStorage.getItem('arrayOfData') || "[]");
    // displayData(data)
    console.log(groups.data)
    displayGroups(groups.data.data)
}
function displayData(arr){
    chatBox.innerHTML='';
    console.log(arr);
    for(let i=0; i<arr.length; i++){
        let p = document.createElement('p')
        p.setAttribute('id', arr[i].userId)
        if(arr[i].userId == localStorage.getItem('currentUserId')){
            p.innerHTML = `you: ${arr[i].text}`
        }
        else{
            p.innerHTML=`${arr[i].name}: ${arr[i].text}`;
        }
        chatBox.append(p);
    }
}

// setInterval(async() => {
//     await updateLocalStorage()
//     const data = JSON.parse(localStorage.getItem('arrayOfData') || "[]");
//     //console.log(data)
//     chatBox.innerHTML=''
//         for(let i=0; i<data.length; i++){
//             displayData(data[i]);
//         }
// },1000)


async function updateLocalStorage(){
    const token = localStorage.getItem('token')
    let oldData = JSON.parse(localStorage.getItem('arrayOfData') || "[]");
    const lastMessageId = (oldData.length === 0)?-1:oldData[oldData.length-1].id;
    const data = await axios.get(`http://localhost:3000/getMessages?lastMessageId=${lastMessageId}`, {headers:{'Authorization':token}})
    let newData = data.data.data
    let mergedData = [...oldData, ...newData]
    localStorage.setItem('arrayOfData', JSON.stringify(mergedData));
}
