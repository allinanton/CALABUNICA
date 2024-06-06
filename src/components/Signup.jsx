import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Signup = () => {
  const { signUpWithGmail, createUser, updateUserProfile } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;

    createUser(email, password)
      .then((result) => {
        const user = result.user;
        updateUserProfile(data.name, data.photoURL)
          .then(() => {
            const userInfo = {
              name: data.name,
              email: data.email,
            };

            axiosPublic.post("/users", userInfo)
              .then((response) => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Înregistrare reușită!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                navigate(from, { replace: true });
              })
              .catch((error) => {
                if (error.response && error.response.status === 409) {
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Emailul există deja în baza de date!",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Eroare la înregistrare!",
                    text: "Vă rugăm să încercați din nou.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              });
          })
          .catch((error) => {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Eroare la actualizarea profilului!",
              text: error.message,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Emailul există deja!",
            text: "Vă rugăm să utilizați un alt email.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Eroare la înregistrare!",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  // login with google
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const userInfo = {
          email: result.user?.email,
          name: result.user?.displayName,
        };
        axiosPublic.post('/users', userInfo)
          .then((res) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Login successful!",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate('/');
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Emailul există deja în baza de date!",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Eroare la înregistrare!",
                text: "Vă rugăm să încercați din nou.",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Eroare la autentificare!",
          text: error.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Înregistrare!</h3>
          {/* name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nume</span>
            </label>
            <input
              type="name"
              placeholder="numele tău"
              className="input input-bordered"
              {...register("name", { required: true })}
            />
            {errors.name && <span className="text-red text-xs italic">Un nume este necesar</span>}
          </div>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Adresă de email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email", {
                required: "Un email este necesar",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Adresa de email nu este validă"
                }
              })}
            />
            {errors.email && <span className="text-red text-xs italic">{errors.email.message}</span>}
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Parolă</span>
            </label>
            <input
              type="password"
              placeholder="parolă"
              className="input input-bordered"
              {...register("password", {
                required: "O parolă este necesară",
                minLength: {
                  value: 7,
                  message: "Parola trebuie să aibă cel puțin 7 caractere"
                },
                maxLength: {
                  value: 20,
                  message: "Parola nu poate avea mai mult de 20 de caractere"
                },
                pattern: {
                  value: /\d/,
                  message: "Parola trebuie să conțină cel puțin o cifră"
                }
              })}
            />
            {errors.password && <span className="text-red text-xs italic">{errors.password.message}</span>}
          </div>

          {/* submit btn */}
          <div className="form-control mt-6">
            <input
              type="submit"
              className="btn bg-orange text-white"
              value="Înregistrare"
            />
          </div>

          <div className="text-center my-2">
            Ai deja un cont?
            <Link to="/login">
              <button className="ml-2 underline">Autentifică-te aici</button>
            </Link>
          </div>
        </form>
        <div className="text-center space-x-3">
          <button
            onClick={handleRegister}
            className="btn btn-circle hover:bg-orange hover:text-white"
          >
            <FaGoogle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
