const message = document.getElementById("message-input");
const  chatBox = document.getElementById("chat-box");
const button = document.getElementById('send-button');
const createGroup = document.getElementById('create-group')
const divGroups = document.getElementById('users-list') 

const socket = io.connect("http://localhost:3000");

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

socket.on('message', (msg, userName, groupId,userId) => {
    if(localStorage.getItem('currentGroupId')){
        let grpId=localStorage.getItem('currentGroupId');
        let token = localStorage.getItem('token')
        //let currentUser=parseJwt(token)
        if(groupId == grpId){
            console.log('ye andar aagaya')
          const newPara = document.createElement('p');
          newPara.innerText = `${userName}: ${msg}`;
          chatBox.appendChild(newPara);
  
        }
       }
})

socket.on("file",(message,userName,groupId,userId) => {
    if(localStorage.getItem('currentGroupId')){
      let grpId=localStorage.getItem('currentGroupId');
      const token = localStorage.getItem('token')
      let currentuser=parseJwt(token);
      const chats=document.getElementById('chatBox'); 
  
      if(groupId == grpId){
      let newpara=document.createElement('p');
      let fileLink = document.createElement('a');
      fileLink.href=message;
      fileLink.innerText="click to see(download)";
  
      newpara.appendChild(document.createTextNode(`${userName}:`))
      newpara.appendChild(fileLink);
     chats.append(newpara)
  
      }  
    }
  })

localStorage.setItem('arrayOfData', []);
//events
createGroup.addEventListener('click', createGroupFunc);
window.addEventListener("DOMContentLoaded", someFunc)


async function createGroupFunc(){
    const name = prompt('Enter group Name:')
    const token = localStorage.getItem('token')
    const data = await axios.post('http://localhost:3000/createGroup', {name: name}, {headers:{'Authorization':token}})
    displayGroup(data.data)

}

function displayGroup(obj){
    const token = localStorage.getItem('token')
    const user = parseJwt(token)
        let p = document.createElement('p')
        p.style.cursor= 'pointer';
        p.setAttribute('id', obj.id)
        p.innerHTML=obj.name;
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
        if(obj.createdBy !== user.email){
            button.style.visibility='hidden'
            removeUserbutton.style.visibility='hidden'
            changeAdminButton.style.visibility='hidden'
        }
        p.addEventListener('click', getChat)
}
async function addButton(){
    const email = prompt('enter the email of the user')
    const id = this.parentNode.getAttribute("id")
    console.log(id)
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
    chatBox.innerHTML='';
    displayData(res.data.data)
}
async function sendFunc(event){
    console.log(document.getElementById('uploadBtn').files[0])
    event.preventDefault();
    if(document.getElementById('uploadBtn').files[0] !== undefined){

        const token = localStorage.getItem('token');
        const groupId=localStorage.getItem('currentGroupId');
        let file=document.getElementById('uploadBtn').files[0];
        let formData=new FormData();
        formData.append("file", file)
        const headers={
          "Authorization":token,
          'Content-Type':'multipart/form-data'
    
        }
    
        const res=await axios.post(`http://localhost:3000/app/upload/${groupId}`,formData,{headers})
    
        showfilelink(res.data.userFile);
        socket.emit("file",res.data.userFile.message,res.data.userFile.name,groupId,res.data.userFile.userId)
        }
    else{
        const groupId =  localStorage.getItem('currentGroupId');
        const obj = {
            message: message.value
        }
        message.value = ''
        const token = localStorage.getItem('token');
        const post = await axios.post(`http://localhost:3000/app/${groupId}`, obj, {headers:{'Authorization':token}})
        console.log(post.data);
        showTextMsg(post.data);
        socket.emit('message',post.data.text, post.data.name, localStorage.getItem('currentGroupId'), post.data.userId)
    }
    
}
function showTextMsg(obj){
    const p = document.createElement('p');
    p.innerHTML=`You: ${obj.text}`
    chatBox.append(p);
}

function showfilelink(userFile){
    const token = localStorage.getItem('token')
    let currentuser=parseJwt(token);
    const chats=document.getElementById('chatBox'); 
    let newpara=document.createElement('p');
    let fileLink = document.createElement('a');
  
    fileLink.href=userFile.message;
    fileLink.innerText="click to see(download)";
  
    if(userFile.userId == currentuser.id){
      newpara.appendChild(document.createTextNode(`You:`))
    }
  
    else{
      newpara.appendChild(document.createTextNode(`${userFile.name}:`))
    }
  
   newpara.appendChild(fileLink);
   chatBox.append(newpara)
  
  
  }

async function someFunc(){
    displayGroups()
}
function displayData(arr){
    console.log(arr);
    const token = localStorage.getItem('token')
    const currentUserId = localStorage.getItem('currentUserId');
    chatBox.innerHTML='';
    console.log(arr);
    if(arr.length>10)
    {
        arr = arr.slice(arr.length-10)
    }
    for (const chat of arr) {
        const newPara = document.createElement('p');
     if(chat.type == 'text'){
        if (chat.userId == currentUserId) {
          newPara.innerText = `You: ${chat.text}`;
        } else {
          newPara.innerText = `${chat.name}: ${chat.text}`;
        }
  
      }
  
      else{
        let fileLink = document.createElement('a');
        fileLink.href=chat.text;
        fileLink.innerText="click to see(download)";
  
        if(chat.userId == currentUserId){
          newPara.appendChild(document.createTextNode(`You:`))
        }
        else{
          newPara.appendChild(document.createTextNode(`${chat.name}:`))
        } 
        newPara.appendChild(fileLink);
      }
  
        chatBox.append(newPara);
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


// async function updateLocalStorage(){
//     const token = localStorage.getItem('token')
//     let oldData = JSON.parse(localStorage.getItem('arrayOfData') || "[]");
//     const lastMessageId = (oldData.length === 0)?-1:oldData[oldData.length-1].id;
//     const data = await axios.get(`http://localhost:3000/getMessages?lastMessageId=${lastMessageId}`, {headers:{'Authorization':token}})
//     let newData = data.data.data
//     let mergedData = [...oldData, ...newData]
//     localStorage.setItem('arrayOfData', JSON.stringify(mergedData));
// }
async function displayGroups(){
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('currentUserId')
    const res = await axios.get('http://localhost:3000/getGroups', {headers:{'Authorization':token}})
    for(let i=0; i<res.data.data.length; i++){
        displayGroup(res.data.data[i])
    }

}