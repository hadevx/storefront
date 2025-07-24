import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Layout from "../../Layout";
import { useRegisterUserMutation } from "../../redux/queries/userApi";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading, refetch }] = useRegisterUserMutation();

  const handleRegister = async (e) => {
    e.preventDefault();
    const hasNumbers = /\d/;
    try {
      if (!email || !password || !password || !phone) {
        return toast.error("All fields are required");
      }
      if (hasNumbers.test(name)) {
        return toast.error("Name should not contain numbers");
      }
      if (name.toLowerCase() === "admin") {
        return toast.error("Name is not valid");
      }
      if (phone.length !== 8 || phone.charAt(0) === 0) {
        return toast.error("Phone number is not valid");
      }
      if (password !== confirmPassword) {
        return toast.error("Passwords don't match");
      }
      const res = await registerUser({ name, email, phone, password }).unwrap();
      dispatch(setUserInfo({ ...res }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "an error occurred");
    }
  };
  return (
    <>
      <Layout>
        <div className=" flex flex-col items-center justify-center  min-h-screen text-black">
          <div>
            <h1 className="mb-5 text-[20px] font-semibold">Create an account</h1>
          </div>
          <div>
            <form onSubmit={handleRegister}>
              <div className=" h-[40px] bg-opacity-50 w-[300px] rounded-md bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
                <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className=" w-full shadow border rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                />
              </div>
              <div className=" h-[40px] bg-opacity-50 w-[300px] rounded-md   bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=" w-full shadow border rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4  outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                />
              </div>
              <div className=" h-[40px] shadow border  bg-opacity-50 w-[300px] rounded-md   bg-gray-100  placeholder:text-grey-40  flex items-center mb-4">
                <div className="py-3 px-2  ">965</div>
                <input
                  type="number"
                  placeholder="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  className=" w-full  border-l  h-full py-3 px-2 bg-gray-100 bg-opacity-50   outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                />
              </div>
              <div className="rounded-md border relative  h-[40px]  w-[300px]   bg-gray-100  placeholder:text-grey-40  flex items-center mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full shadow rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4 outline-none outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                />
                <button
                  type="button"
                  className="text-grey-40 absolute right-0 focus:text-violet-60 px-4 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye strokeWidth={1} />
                  ) : (
                    <span>
                      <EyeOff strokeWidth={1} />
                    </span>
                  )}
                </button>
              </div>
              <div className="rounded-md border relative  h-[40px]  w-[300px]   bg-gray-100  placeholder:text-grey-40  flex items-center mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full shadow rounded-md h-full bg-gray-100 bg-opacity-50 py-3 px-4 outline-none outline-0 focus:shadow-[0_0_0_4px_rgba(74,157,236,0.2)] focus:border-[#4A9DEC] focus:border"
                />
                <button
                  type="button"
                  className="text-grey-40 absolute right-0 focus:text-violet-60 px-4 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye strokeWidth={1} />
                  ) : (
                    <span>
                      <EyeOff strokeWidth={1} />
                    </span>
                  )}
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full mt-4 border rounded-lg font-semibold flex items-center justify-center  px-3 py-2  transition-all delay-50 bg-gradient-to-r from-slate-800 to-slate-600 shadow-md text-white hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-900">
                  {!isLoading ? "Register" : <Spinner className="border-t-slate-700" />}
                </button>
              </div>
            </form>
            <div className="mt-5">
              <span>Already have an account? </span>
              <Link to="/login" className="font-bold underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Register;
