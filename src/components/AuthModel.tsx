import React from 'react'

type AuthModelProps = {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModel = ({ isOpen, onClose }: AuthModelProps) => {
  return (
    <div>AuthModel</div>
  )
}

export default AuthModel