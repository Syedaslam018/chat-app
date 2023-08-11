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
    localStorage.setItem('currentUserId',parseJwt(localStorage.getItem('token')).id)
    window.location=`http://localhost:3000/App/app.html`

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

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }