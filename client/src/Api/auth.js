import axios from 'axios';

export const signUpApi=async(name,email,password,pic)=>{
const form = new FormData();
form.append('name', name);
form.append('email', email);
form.append('password', password);
if(pic){
    form.append('pic', pic);

}

const {data}=await axios.post(`http://localhost:8000/api/v1/user/signup`,form);

return data;
}

export const loginApi=async(email,password)=>{
    const form = new FormData();
    console.log(email, password);
    form.append('email', email);
    form.append('password', password);
     const {data}=await axios.post(`http://localhost:8000/api/v1/user/login`,form);
    
    return data;
    }

