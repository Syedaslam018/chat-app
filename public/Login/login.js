const myForm = document.getElementById('myForm')
const username = document.getElementById('username')
const password = document.getElementById('password');

myForm.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault()
    const obj = {
        username: username.value,
        password: password.value
    }
    const data = axios.post('http://localhost:3000/login', obj);
    console.log(obj)
}