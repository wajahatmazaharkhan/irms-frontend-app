'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera } from 'lucide-react'
import TopNavBar from "../Components/TopNavbar"
import useTitle from "@/Components/useTitle"

function Hrprofile() {
  useTitle('HR Profile')
  

  const [profileinfo, setProfileInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    bio: "",
  })
  const [profile, setProfile] = useState({
    photo: null,
  })

  //special handle on change function to handle files input means image input

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfile(prev => ({ ...prev, [type]: file }))
    }
  }



  const handleOnChange =(e)=>{
const {name,value} = e.target;
setProfileInfo({
  ...profileinfo,
  [name]:value,
})
  }



  const handleSubmit = (e) => {
    e.preventDefault(); 

  console.log("api call here")
  
    console.log('Profile Data:', profileinfo);
   
    if (profile.photo) {
      console.log('Profile photo:', profile.photo);
    }

  }

  return (
    <>
    <TopNavBar></TopNavBar>
    <div className="w-full max-w-4xl mx-auto mt-12 p-4 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-nonetl-3xl border-2 border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="relative w-full h-[200px] bg-gradient-to-r from-blue-100 to-amber-50"></div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 pb-8">
            <div className="flex justify-between items-center -mt-10 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-32 h-32 rounded-nonefull border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center"
              >
                {profile.photo ? (
                  <img
                    src={URL.createObjectURL(profile.photo)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center' }}
                  />
                ) : (
                  <span className="text-gray-400 text-xl">Profile</span>
                )}
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-0 right-0 p-4 shadow-md"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </motion.button>
              </motion.div>

              <div className="mr-60 mt-8">
                <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500">Update your photo and personal details</p>
              </div>
              <motion.button
                type="submit" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-nonemd shadow-sm mt-16"
              >
                Save
              </motion.button>
            </div>

          
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-nonemd focus:ring-2 focus:ring-blue-500 focus:border-transparent "
                    placeholder="Name"
                    name="firstname"
                    value={profileinfo.firstname}
                    onChange={handleOnChange} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-nonemd focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last name"
                    name="lastname"
                    value={profileinfo.lastname}
                    onChange={handleOnChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-nonemd focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                    name="email"
                    value={profileinfo.email}
                    onChange={handleOnChange} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Bio
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-nonemd focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Add a short bio..."
                    name="bio"
                    value={profileinfo.bio}
                    onChange={handleOnChange} 
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  </>

  )
}

export default Hrprofile;
