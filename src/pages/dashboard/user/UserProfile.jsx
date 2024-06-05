import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useForm } from 'react-hook-form';

const UserProfile = () => {
  const { user } = useContext(AuthContext); // Assuming user context provides user details
  const { register, handleSubmit } = useForm();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const onSubmit = async (data) => {
    const name = data.name;
    const photoURL = selectedPhoto;

    if (!user?.email) {
      console.error('User email is undefined');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ email: user.email, name, photoURL }),
      });

      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        console.error("Failed to update profile");
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Error updating profile');
    }
  };

  const handlePhotoSelect = (photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <div className='h-screen max-w-md mx-auto flex items-center justify-center'>
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input type="text" {...register('name')} placeholder="Your name" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose a Photo</span>
            </label>
            <div className="flex justify-between mt-2">
              {['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map((photo) => (
                <img
                  key={photo}
                  src={`/images/home/userphotos/${photo}`}
                  alt={photo}
                  className={`w-16 h-16 rounded-full cursor-pointer ${selectedPhoto === `/images/home/userphotos/${photo}` ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => handlePhotoSelect(`/images/home/userphotos/${photo}`)}
                />
              ))}
            </div>
          </div>
          <div className="form-control mt-6">
            <input type='submit' value={"Update"} className="btn bg-orange text-white" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
