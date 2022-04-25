import React,{useState} from 'react'
import {auth} from '../Config/Config'
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    
    const navigate =useNavigate();

    
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleLogin=(e)=>{
        e.preventDefault();
        // console.log(email, password);
        auth.signInWithEmailAndPassword(email,password).then(()=>{
            setSuccessMsg('Login Successfull. You will now automatically get redirected to Home page');
            setEmail('');
            setPassword('');
            setErrorMsg('');
            setTimeout(()=>{
                setSuccessMsg('');
                navigate('/');
            },3000)
        }).catch(error=>setErrorMsg(error.message));
    }

  return (
    <div className='container'>
    <br/>
    <br/>
    <h1>Login</h1>
    <hr/>
    {successMsg&&<>
        <div className='success-msg'>{successMsg}</div>
        <br/>
        </>}
    <form className='form-group' autoComplete='off' onSubmit={handleLogin}>
        <label>Email</label>
        <input type='email' className='form-control'
         onChange={(e)=>setEmail(e.target.value)} value={email}
        required></input>
        <br/>
        <label>Password</label>
        <input type='password' className='form-control'
         onChange={(e)=>setPassword(e.target.value)} value={password} 
         required></input>
        <br/>

        <div className='btn-box'>
            <span> Don't have an account?
                <Link to='signup' className='link'>Sign up</Link>
            </span>
            <button type='submit' className='btn btn-success btn-md'>Login</button>
        </div>
        

    </form>
    {errorMsg&&<>
            <div className='error-msg'>{errorMsg}</div>
        </>}

</div>
  )
}

export default Login