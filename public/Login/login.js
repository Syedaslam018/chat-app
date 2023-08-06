const myForm = document.getElementById('myForm')
const username = document.getElementById('username')
const password = document.getElementById('password');
const ul = document.getElementById('data')

myForm.addEventListener('submit', onSubmit);

async function onSubmit(e){
    try{
    e.preventDefault()
    const obj = {
        username: username.value,
        password: password.value
    }
    const post = await axios.post('http://localhost:3000/login', obj);
    console.log(post.data)
    displayData(post)
    localStorage.setItem('token', post.data.token)
    alert('User Logged in successfully')
    window.location=`file:///C:/Users/aslam's/Documents/MyStuff/app-chat/public/App/app.html`

}
catch(e){
    displayData(e.response);
}
}

function displayData(o){
    let li = document.createElement('li')
    li.innerHTML ='Status-'+ o.status + ' '+ o.data.message;
    ul.appendChild(li);
  }