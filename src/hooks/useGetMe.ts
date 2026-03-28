'use client'
import axios from 'axios'
import React, { useEffect } from 'react'

function useGetMe(enabled: boolean) {
  useEffect(()=>{
    if(!enabled) return
    const getMe = async () => {
        const {data} = await axios.get('/api/user/me')
        console.log(data)
    }
    getMe()
  }, [enabled])
}

export default useGetMe
