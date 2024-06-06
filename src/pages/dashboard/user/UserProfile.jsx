import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const UserProfile = () => {
  const { updateUserProfile, user } = useContext(AuthContext);
  const { register, handleSubmit, setValue } = useForm();
  const [selectedPhoto, setSelectedPhoto] = useState(user?.photoURL || null);

  useEffect(() => {
    if (user) {
      setValue("name", user.displayName || "");
      setValue("phoneNumber", user.phoneNumber || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const { name, phoneNumber } = data;
    const photoURL = selectedPhoto;

    if (!user?.email) {
      console.error('User email is undefined');
      return;
    }

    try {
      await updateUserProfile(name, photoURL);

      const response = await fetch(`http://localhost:5000/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ email: user.email, name, phoneNumber, photoURL }),
      });

      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Modificări profil salvate cu succes',
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Eroare la modificarea profilului',
        showConfirmButton: false,
        timer: 2000
      });
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
              <span className="label-text">Nume</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="nume"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Număr de telefon</span>
            </label>
            <input
              type="text"
              {...register("phoneNumber")}
              placeholder="număr de telefon"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Alegeți un avatar</span>
            </label>
            <div className="flex justify-between mt-2">
              {['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map((photo) => (
                <img
                  key={photo}
                  src={`images/home/userphotos/${photo}`}
                  alt={photo}
                  className={`w-16 h-16 rounded-full cursor-pointer ${selectedPhoto === `images/home/userphotos/${photo}` ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => handlePhotoSelect(`images/home/userphotos/${photo}`)}
                />
              ))}
            </div>
          </div>
          <div className="form-control mt-6">
            <input type='submit' value={"Salvați Modificările"} className="btn bg-orange text-white" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
