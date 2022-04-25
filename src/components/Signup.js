import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {auth, fs} from '../Config/Config'


const Signup = () => {
    
    
   
    const navigate =useNavigate();
    
    const [fullName, setFullname]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    
    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleSignup=(e)=>{
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email,password).then((cred)=>{
            fs.collection('users').doc(cred.user.uid).set({
                FullName:fullName,
                Email:email,
                Password:password
            }).then(()=>{
                setSuccessMsg('Signup Successfull.You will now automatically get redirected to login');
                setFullname('');
                setEmail('');
                setPassword('')
                setErrorMsg('');
                setTimeout(()=>{
                    setSuccessMsg('');
                    navigate('/login');
                },3000)
            }).catch((error)=>setErrorMsg(error.message));
        }).catch((error)=>{
            setErrorMsg(error.message)

        })


        
    }

  return (
    <div className='container'>
        <br/>
        <br/>
        <h1>Sign up</h1>
        <hr/>
        {successMsg&&<>
        <div className='success-msg'>{successMsg}</div>
        <br/>
        </>}
        <form className='form-group' autoComplete='off' onSubmit={handleSignup}>
            <label>Full Name</label>
            <input type='text' className='form-control'
            onChange={(e)=>setFullname(e.target.value)} value={fullName}
            required></input>
            <br/>
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
                <span> Already have an account?
                    <Link to='login' className='link'>Login</Link>
                </span>
                <button type='submit' className='btn btn-success btn-md'>SIGN UP</button>
            </div>
            

        </form>
        {errorMsg&&<>
            <div className='error-msg'>{errorMsg}</div>
        </>}

    </div>
  )
}

export default Signup