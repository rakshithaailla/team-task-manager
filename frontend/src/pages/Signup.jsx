import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "member",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/signup", formData);
            alert("Signup successful. Please login.");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Team Task Manager
                </h1>

                <h2 className="text-xl font-semibold mb-5 text-center">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

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

                    <select
                        name="role"
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                    >
                        Signup
                    </button>
                </form>

                <button
                    onClick={() => navigate("/")}
                    className="w-full mt-5 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default Signup;