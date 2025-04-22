import React, { useContext, useRef, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { FiPlus } from "react-icons/fi";
import { CiCamera } from "react-icons/ci";
import userlogo from '../assets/userlogo.png'
import axios from 'axios';
import { authContext } from '../context/AuthContext.jsx';

function EditProfile({ setEdit, setUserData, userData }) {
    const {serverUrl} = useContext(authContext)
    const [firstName, setFirstName] = useState(userData.firstName || "")
    const [lastName, setLastName] = useState(userData.lastName || "")
    const [userName, setUserName] = useState(userData.userName || "")
    const [email, setEmail] = useState(userData.email || "")
    const [headline, setHeadline] = useState(userData.headline || "")
    const [location, setLocation] = useState(userData.location || "")
    const [gender, setGender] = useState(userData.gender || "")
    const [skills, setSkills] = useState(userData.Skils || [])
    const [newSkills, setNewSkills] = useState("")
    const [educations, setEducations] = useState(userData.education || [])
    const [newEducation, setNewEducation] = useState({
        collage: "",
        degree: "",
        fieldOfStudy: ""
    })
    const [experience, setExperience] = useState(userData.experience || [])
    const [newExperience, setNewExperience] = useState({
        title: "",
        company: "",
        description: ""
    })
    const [isLoading, setIsLoadin] = useState(false);
    const profileImage = useRef()
    const coverImage = useRef()
    const [cimg, setCimg] = useState(null)
    const [pimg, setPimg] = useState(null)
    const [tcimg, setTcimg] = useState(userData.coverImage||null)
    const [tpimg, setTpimg] = useState(userData.profileImage||userlogo)

    const addSkill = () => {
        if (newSkills && !skills.includes(newSkills)) {
            setSkills([...skills, newSkills])
            setNewSkills("")
        }
    }
    const removeSkill = (skill) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter((s) => s !== skill))
        }
    }
    const removeEducation = (education) => {
        if (educations.includes(education)) {
            setEducations(educations.filter((edu) => edu !== education))
        }
    }

    const addEducation = () => {
        if (newEducation.collage && newEducation.degree && newEducation.fieldOfStudy) {
            setEducations([...educations, newEducation])
            setNewEducation({
                collage: "",
                degree: "",
                fieldOfStudy: ""
            })
        }
    }
    const addExperience = () => {
        if (newExperience.title && newExperience.company && newExperience.description) {
            setExperience([...experience, newExperience])
            setNewExperience({
                title: "",
                company: "",
                description: ""
            })
        }
    }

    const removeExperience = (exper) => {
        if (experience.includes(exper)) {
            setExperience(experience.filter((ex) => ex !== exper))
        }
    }


    const handleProfileImage = (e)=>{
           let file = e.target.files[0]
           setPimg(file)
           setTpimg(URL.createObjectURL(file))
    }
 
    const handleCoverImage = (e)=>{
        let file = e.target.files[0]
        setCimg(file)
        setTcimg(URL.createObjectURL(file))   
    }
      
    const handleSaveProfile = async ()=>{
       
        try {
        setIsLoadin(true)
         let formData = new FormData()
         formData.append('firstName', firstName)
         formData.append('lastName', lastName)
         formData.append('userName', userName)
         formData.append('headline', headline)
         formData.append('skills', JSON.stringify(skills))
         formData.append('education', JSON.stringify(educations))
         formData.append('gender', gender)
         formData.append('experience', JSON.stringify(experience))
         formData.append('location', location)
         
        if(cimg){
            formData.append('coverImage', cimg)
        }
        if(pimg){
            formData.append('profileImage', pimg)
        }
         
         const {data} = await axios.put(serverUrl + '/api/user/updateprofile', formData, {withCredentials:true})
         setIsLoadin(false)
          if(data.success){
            setUserData(data.user)
            setEdit(false)
          }else{
            alert(data.message)
          }
        } catch (error) {
            setIsLoadin(false)
            alert(error.message)   
        }
    }

    return (
        <div className='w-full h-[100%] fixed top-0 z-[100] flex items-center justify-center'>
             <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>
             <input type="file" accept='image/*' hidden ref={coverImage}  onChange={handleCoverImage}/>
            <div className='w-full h-full  bg-black opacity-[0.5] absolute'></div>
            <div className=' overflow-auto w-[90%] p-2 max-w-[500px] h-[600px] bg-white rounded-lg shadow-lg relative z-[200]'>
                <div onClick={() => setEdit(false)} className=' cursor-pointer absolute right-2 top-2 '><RxCross1 className='w-[23px] h-[23px] text-gray-800 font-bold' /></div>


                <div onClick={()=>coverImage.current.click()} className='w-full cursor-pointer mt-6 h-[150px] overflow-hidden bg-gray-500 rounded-lg'>
                    <img src={tcimg} alt="" className='w-full' />
                    <CiCamera className=' absolute right-5 top-10 text-2xl font-bold cursor-pointer text-white' />
                </div>
                <div onClick={()=>profileImage.current.click()} className='absolute top-[150px] left-[30px] w-[50px] h-[50px] rounded-full overflow-hidden'>
                    <img src={tpimg} alt="" className='w-full' />
                </div>
                <div onClick={()=>profileImage.current.click()} className='absolute cursor-pointer top-[180px] left-[60px] w-[15px] h-[15px] text-white rounded-full bg-blue-400  flex items-center'>
                    <FiPlus className='font-bold ' />
                </div>


                <div className='w-full mt-10 flex flex-col items-center justify-center gap-5'>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='firstName' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='lastName' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='userName' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                    <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder='headline' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder='location' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                    <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder='gender (male/female/other)' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />

                    <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-3'>
                        <h1>Skils</h1>
                        {skills && <div className='flex gap-2 flex-wrap'>
                            {skills.map((skill, index) => (
                                <div key={index} className='px-2 py-1 rounded-md bg-[#2dc0ff] flex items-center gap-1 text-white font-bold'>{skill} <RxCross1 onClick={() => removeSkill(skill)} className=' cursor-pointer' /></div>
                            ))}
                        </div>}
                        <div>
                            <input type="text" value={newSkills} onChange={(e) => setNewSkills(e.target.value)} placeholder='Add new skill' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                            <button onClick={addSkill} className='w-full mt-2 h-[40px] rounded-full  border-2 border-[#2dc0ff]  text-[#2dc0ff]'>Add</button>
                        </div>
                    </div>

                    <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-3'>
                        <h1>Education</h1>
                        {educations && <div className='flex flex-col gap-2 flex-wrap'>
                            {educations.map((education, index) => (
                                <div key={index} className='px-2 py-1 rounded-md bg-[#2dc0ff] flex items-center justify-between text-white font-semibold gap-1'>
                                    <div className='flex flex-wrap gap-2 '>
                                        <div>Collage: {education.collage}</div>
                                        <div>Degree: {education.degree}</div>
                                        <div>Field OF Study: {education.fieldOfStudy}</div>
                                    </div>
                                    <RxCross1 onClick={() => removeEducation(education)} className=' cursor-pointer' />
                                </div>
                            ))}
                        </div>}
                        <div className='flex flex-col gap-2'>
                            <input type="text" value={newEducation.collage} onChange={(e) => setNewEducation({ ...newEducation, collage: e.target.value })} placeholder='Collage Name' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                            <input type="text" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder='Degree' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                            <input type="text" value={newEducation.fieldOfStudy} onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} placeholder='Field Of Study' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                            <button onClick={addEducation} className='w-full mt-2 h-[40px] rounded-full  border-2 border-[#2dc0ff]  text-[#2dc0ff]'>Add</button>
                        </div>
                    </div>

                    <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-3'>
                        <h1>Experience</h1>
                        {experience && <div className='flex flex-col gap-2 flex-wrap'>
                            {experience.map((exper, index) => (
                                <div key={index} className='px-2 py-1 rounded-md bg-[#2dc0ff] flex items-center justify-between text-white font-semibold gap-1'>
                                    <div className='flex flex-wrap gap-2 '>
                                        <div>Title: {exper.title},</div>
                                        <div>Company: {exper.company},</div>
                                        <div>Description: {exper.description}</div>
                                    </div>
                                    <RxCross1 onClick={() => removeExperience(exper)} className=' cursor-pointer' />
                                </div>
                            ))}
                        </div>}
                        <div className='flex flex-col gap-2'>
                            <input type="text" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} placeholder='Job title' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                            <input type="text" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} placeholder='Company' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                            <input type="text" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} placeholder='Description ' className='w-full h-[50px] outline-none border-gray-600 px-2 py-1 text-[18px] border-2 rounded-lg' />
                            <button onClick={addExperience} className='w-full mt-2 h-[40px] rounded-full  border-2 border-[#2dc0ff]  text-[#2dc0ff]'>Add</button>
                        </div>
                    </div>
                    <button onClick={handleSaveProfile} disabled={isLoading} type='submit' className='bg-blue-600 mt-5 text-white py-2 w-full rounded-full'>{isLoading? "Loading..": "Save Profile"}</button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile