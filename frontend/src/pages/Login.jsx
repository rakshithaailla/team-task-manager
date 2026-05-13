import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", formData);
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Team Task Manager
                </h1>

                <h2 className="text-xl font-semibold mb-5 text-center">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-5 text-gray-600">
                    Don&apos;t have an account?
                </p>

                <button
                    onClick={() => navigate("/signup")}
                    className="w-full mt-3 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50"
                >
                    Create New Account
                </button>
            </div>
        </div>
    );
}

export default Login;