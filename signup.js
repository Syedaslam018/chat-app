const userName = document.getElementById('name')
const email = document.getElementById('email')
const phno = document.getElementById('phno')
const password = document.getElementById('password')
const myForm = document.getElementById('myForm');

myForm.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();
    const obj = {
        name:userName.value,
        email:email.value,
        phno:phno.value,
        password:password.value
    }
    console.log(obj)
    const data = await axios.post("http://localhost:3000/signup", obj)
    console.log(data.data);
}