import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Login = () => {
  const axiosPublic = useAxiosPublic();
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  //react hook form
  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    login(email, password)
      .then((result) => {
        // Signed in
        const user = result.user;

        const userInfo = {
          email: result.user?.email,
          name: result.user?.displayName
        }
        axiosPublic.post('/users', userInfo)
          .then(res => {
            console.log(res.data);
            navigate('/');
          })
        // console.log(user);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Autentificare reușită!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/');
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        seterrorMessage("Vă rog introduceți o parolă și email valide!");
      });
    reset()

  };

  // login with google
  const handleRegister = () => {
    signUpWithGmail().then(result => {
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName
      }
      axiosPublic.post('/users', userInfo)

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Autentificare reușită!",
        showConfirmButton: false,
        timer: 1500,

      })
      navigate('/');
    })
  };
  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form
          className="card-body"
          method="dialog"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="font-bold text-lg">Autentificare!</h3>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Adresă de email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email")}
            />
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
              {...register("password", { required: true })}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover mt-2">
                Ați uitat parola?
              </a>
            </label>
          </div>

          {/* show errors */}
          {errorMessage ? (
            <p className="text-red text-xs italic">
              Vă rog introduceți o parolă și email valide.
            </p>
          ) : (
            ""
          )}

          {/* submit btn */}
          <div className="form-control mt-4">
            <input
              type="submit"
              className="btn bg-orange text-white"
              value="Autentificare"
            />
          </div>



          <p className="text-center my-2">
            Nu aveți un cont?
            <Link to="/signup" className="underline text-red ml-1">
              Creeați un cont nou
            </Link>
          </p>
        </form>
        <div className="text-center space-x-3">
          <button onClick={handleRegister} className="btn btn-circle hover:bg-orange hover:text-white">
            <FaGoogle />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login