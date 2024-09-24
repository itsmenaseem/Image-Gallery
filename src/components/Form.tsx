"use client"
import axios, { AxiosError } from 'axios';
import React, { ChangeEvent, FormEvent, useState} from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners'; // Import spinner component
export default function Form() {
  const [show,setShow]=useState<boolean>(false);
  const [show1,setShow1]=useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const[data,setData]=useState({
    email:"",
    password:"",
    name:"",
    confirmPassword:""
  });

  function changeHandler(e:ChangeEvent<HTMLInputElement>){
      setData((pre) =>{
        return {...pre,[e.target.name]:e.target.value}
      })
  }  
  const [logIn,setLogIn]=useState<boolean>(true);
  function clickHandler(logIn:boolean){
    setData({
    email:"",
    password:"",
    name:"",
    confirmPassword:""
    })
    setLogIn(logIn);
    setShow(false)
    setShow1(false)
  }
   async function submitHandler(e:FormEvent<HTMLFormElement>){
            e.preventDefault();
            setLoading(true); 
            // login form
            if(logIn){
                try {
                 await axios.post("/api/user/login",{email:data.email,password:data.password});
                  toast.success("User logged");
                  router.push(`/dashboard`);
                } catch (error:unknown) {
                    console.log(error);
                    
                    toast.error("Invalid Credentials");
                }
            }
            else{ //signup form
                //password and confirm password validation
                if(data.password!==data.confirmPassword){
                    toast.warn("Passwords do not match");
                    setLoading(false);
                    return;
                }
                try {
                  await axios.post("/api/user/signup",{name:data.name,email:data.email,password:data.password});
                  toast.success("account created successfully");
                  router.push(`/dashboard`);
                } catch (error) {
                  const axiosError = error as AxiosError;

                  if (axiosError.response?.status === 409) {
                      toast.warn("Account already exists");
                  } else {
                      // Handle other potential errors
                      toast.error("An error occurred. Please try again.");
                  }
              
                }
                
            }
            setLoading(false);
   }

  return (
    <div className='flex justify-center items-center mt-8'>
      <div className="bg-[#d3f3f1] dark:bg-dark_50 rounded-xl shadow-xl overflow-y-auto max-w-xl w-full  max-h-full border border-gray-200 dark:border-zinc-800 flex justify-center items-center">
      <div className="max-w-sm mx-auto mt-4 mb-8 md:p-0 p-8 relative font-dmSans">
        <div className="mx-auto text-center pb-4 mt-5">
          <h1 className="font-dmSans text-zinc-700 font-bold text-2xl dark:text-light_10 ">{logIn?"Welcome Back to":"Unlock New Experiences. Sign up Today"}</h1>
          <h1 className="text-[#0095ff] font-amaranth font-bold text-4xl tracking-tighter transform transition-transform duration-300 ease-in-out hover:scale-125" ><span>Image</span> <span className='text-pretty text-[#73b036]'>Gallery</span></h1>
        </div>
        <form  onSubmit={submitHandler} method="post">
          <div className="flex flex-col flex-wrap -mx-3 mb-4 mt-7">
            {/* name */}
            {
              !logIn &&
              <div className="w-full px-3 relative">
              <input
                type="text"
                name="name"
                onChange={changeHandler}
                value={data.name}
                className=" w-full text-gray-300 py-2 pl-10 pr-4 outline-none  border rounded"
                placeholder="Full Name"
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-1 right-auto left-[22px] top-[12px] w-[20px] h-[20px] stroke-gray-300 dark:stroke-zinc-600" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            }
          </div>
          {/* email */}
          <div className="flex flex-col flex-wrap -mx-3 mb-4 mt-7">
            <div className="w-full px-3 relative">
              <input
                type="email"
                name="email"
                onChange={changeHandler}
                value={data.email}
                className="form-input w-full text-gray-300 py-2 pl-10 pr-4 outline-none border rounded"
                placeholder="Umair@gmail.com"
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-1 right-auto left-[22px] top-[12px] w-[20px] h-[20px] stroke-gray-300" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
          </div>
          {/* password */}
          <div className="flex flex-wrap -mx-3 mt-8">
            <div className="w-full relative px-3">
              <input
                type={show?"text":"password"}
                name="password"
                onChange={changeHandler}
                value={data.password}
                className="form-input w-full text-gray-300 py-2 pl-10 pr-4 outline-none border rounded"
                placeholder={logIn?"*****":"Password"}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-1 right-auto left-[22px] top-[10px] w-[20px] h-[20px] stroke-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="16" r="1"></circle>
                <rect x="3" y="10" width="18" height="12" rx="2"></rect>
                <path d="M7 10V7a5 5 0 0 1 10 0v3"></path>
              </svg>
             {
              show?(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="absolute inset-1 left-auto right-[22px] top-[10px] w-[20px] h-[20px] stroke-gray-300 dark:stroke-zinc-600 cursor-pointer"
                onClick={()=>setShow(false)}
                ><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>):( <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-1 left-auto right-[22px] top-[10px] w-[20px] h-[20px] stroke-gray-300 dark:stroke-zinc-600 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              onClick={()=>setShow(true)}
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                <line x1="2" x2="22" y1="2" y2="22"></line>
              </svg>)
             }
            </div>
             {
              logIn &&
              <button type="button" className="text-[#0095ff] hover:text-[#0095ff95]  font-semibold transition duration-150 ease-in-out ml-auto text-sm mt-3">
              Forgot Password?
            </button>
             }
          </div>
             {/* confirm password */}
          {
            !logIn &&
            <div className="flex flex-wrap -mx-3 mt-8">
            <div className="w-full relative px-3">
              <input
                type={show1?"text":"password"}
                name="confirmPassword"
                onChange={changeHandler}
                value={data.confirmPassword}
                className="form-input w-full text-gray-300 py-2 pl-10 pr-4 outline-none border rounded"
                placeholder="Confirm Password"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-1 right-auto left-[22px] top-[10px] w-[20px] h-[20px] stroke-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="16" r="1"></circle>
                <rect x="3" y="10" width="18" height="12" rx="2"></rect>
                <path d="M7 10V7a5 5 0 0 1 10 0v3"></path>
              </svg>
             {
              show1?(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="absolute inset-1 left-auto right-[22px] top-[10px] w-[20px] h-[20px] stroke-gray-300 dark:stroke-zinc-600 cursor-pointer"
                onClick={()=>setShow1(false)}
                ><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>):( <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-1 left-auto right-[22px] top-[10px] w-[20px] h-[20px] stroke-gray-300 dark:stroke-zinc-600 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              onClick={()=>setShow1(true)}
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                <line x1="2" x2="22" y1="2" y2="22"></line>
              </svg>)
             }
            </div>
          </div>
          }
              {/* login buttom */}
          {
            logIn  &&
            <div className="flex flex-wrap -mx-3 mt-6">
            <div className="w-full px-3">
              <button type="submit" className="text-md rounded-lg relative inline-flex items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-2 border-l-2 border-r-2 active:border-red-700 active:shadow-none shadow-lg bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-500 border-red-700 text-white w-full"
              disabled={loading}
              >
              {loading?<ClipLoader color="#fff" size={24} />:"Login"}
              </button>
            </div>
          </div>
          }
          {/* signup button */}
          {
            !logIn && 
            <div className="flex flex-wrap -mx-3 mt-6">
            <div className="w-full px-3">
              <button type="submit" className="text-md rounded-lg relative inline-flex items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-2 border-l-2 border-r-2 active:border-red-700 active:shadow-none shadow-lg bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-500 border-red-700 text-white w-full"
              disabled={loading}
              >
                {loading?<ClipLoader color="#fff" size={24} />:"Signup"}
              </button>
            </div>
          </div>
          }
        </form>

        {
            logIn?(<div className="text-gray-600 text-center mt-6">
              Don’t you have an account?{' '}
              <button className="text-[#0095ff] font-semibold hover:text-[#0095ff95] transition duration-150 ease-in-out" onClick={()=>clickHandler(false)}>Create account</button>
            </div>):(<div className="text-gray-600 text-center mt-6">Already have an account? <button className="text-[#0095ff] hover:text-[#0095ff95] font-semibold  transition duration-150 ease-in-out" onClick={()=>clickHandler(true)} >Log in</button></div>
            )
        }
      </div>
      
    </div>
    </div>
  );
};