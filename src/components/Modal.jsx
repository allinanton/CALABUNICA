import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Modal = () => {
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  // modal close button
  const [isModalOpen, setIsModalOpen] = useState(true);
  const closeModal = () => {
    setIsModalOpen(false);
    document.getElementById("my_modal_5").close();
  };

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  //react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;
    try {
      const result = await login(email, password);
      const user = result.user;

      const userInfo = {
        email: user?.email,
        name: user?.displayName
      };

      try {
        const res = await axiosPublic.post('/users', userInfo);
        console.log(res.data);

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Autentificare reușită!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from);  // Navigate to the original requested page
        closeModal();
      } catch (axiosError) {
        if (axiosError.response && axiosError.response.status === 302) {
          const redirectUrl = axiosError.response.headers['location'];
          try {
            const redirectedResponse = await axiosPublic.get(redirectUrl);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Autentificare reușită!",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate(from);  // Navigate to the original requested page
            closeModal();
          } catch (redirectError) {
            seterrorMessage("Eroare după redirecționare. Vă rugăm să încercați din nou.");
          }
        } else {
          seterrorMessage("Vă rog introduceți o parolă și email valide!");
        }
      }
    } catch (error) {
      seterrorMessage("Vă rog introduceți o parolă și email valide!");
    }
    reset();
  };


  // login with google
  const handleRegister = () => {
    signUpWithGmail().then((result) => {
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
      };
      axiosPublic.post("/users", userInfo).then((res) => {
        console.log(res.data);
        navigate("/");
        closeModal();
      });
    });
  };

  return (
    <dialog id="my_modal_5" className={`modal ${isModalOpen ? 'modal-middle sm:modal-middle' : 'hidden'}`}>
      <div className="modal-box">
        <div className="modal-action flex-col justify-center mt-0">
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

            {/* close btn */}
            <div
              htmlFor="my_modal_5"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_5").close()}
            >
              ✕
            </div>

            <p className="text-center my-2">
              Nu aveți un cont?
              <Link to="/signup" className="underline text-red ml-1">
                Creeați un cont nou
              </Link>
            </p>
          </form>
          <div className="text-center space-x-3 mb-5">
            <button
              onClick={handleRegister}
              className="btn btn-circle hover:bg-orange hover:text-white"
            >
              <FaGoogle />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
