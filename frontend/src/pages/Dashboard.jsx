import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Dashboard() {
    const [stats, setStats] = useState({});
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
    });

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
        attachment: null,
    });

    useEffect(() => {
        fetchDashboard();
        fetchProjects();
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await API.get("/dashboard");
            setStats(res.data);
        } catch (error) {
            console.log(
                "Dashboard error:",
                error.response?.data || error.message
            );
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects");
            setProjects(res.data);
        } catch (error) {
            console.log(
                "Projects error:",
                error.response?.data || error.message
            );
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await API.get("/tasks");
            setTasks(res.data);
        } catch (error) {
            console.log(
                "Tasks error:",
                error.response?.data || error.message
            );
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");
            setUsers(res.data);
        } catch (error) {
            console.log(
                "Users error:",
                error.response?.data || error.message
            );
        }
    };

    const handleProjectChange = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTaskChange = (e) => {
        if (e.target.name === "attachment") {
            setTaskData({
                ...taskData,
                attachment: e.target.files[0],
            });
        } else {
            setTaskData({
                ...taskData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const createProject = async (e) => {
        e.preventDefault();

        try {
            await API.post("/projects", projectData);
            toast.success("Project created successfully!");

            fetchProjects();

            setProjectData({
                title: "",
                description: "",
            });
        } catch (error) {
            console.log(error);
        }
    };
    const deleteProject = async (projectId) => {
        try {
            await API.delete(`/projects/${projectId}`);

            toast.error("Project deleted!");

            fetchProjects();
            fetchDashboard();
        } catch (error) {
            toast.error("Only admin can delete projects");
            console.log(error);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", taskData.title);
            formData.append("description", taskData.description);
            formData.append("project", taskData.project);
            formData.append("assignedTo", taskData.assignedTo);
            formData.append("priority", taskData.priority);
            formData.append("dueDate", taskData.dueDate);

            if (taskData.attachment) {
                formData.append("attachment", taskData.attachment);
            }

            await API.post("/tasks", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Task created successfully!");

            fetchTasks();
            fetchDashboard();

            setTaskData({
                title: "",
                description: "",
                project: "",
                assignedTo: "",
                priority: "medium",
                dueDate: "",
                attachment: null,
            });
        } catch (error) {
            toast.error("Task creation failed");
            console.log(error);
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            await API.put(`/tasks/${taskId}`, { status });
            toast.info("Task status updated!");

            fetchTasks();
            fetchDashboard();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await API.delete(`/tasks/${taskId}`);
            toast.error("Task deleted!");
            fetchTasks();
            fetchDashboard();
        } catch (error) {
            console.log(error);
        }
    };
    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            filterStatus === "all" || task.status === filterStatus;

        const matchesPriority =
            filterPriority === "all" || task.priority === filterPriority;

        const matchesSearch =
            task.title.toLowerCase().includes(searchText.toLowerCase()) ||
            task.description.toLowerCase().includes(searchText.toLowerCase());

        return matchesStatus && matchesPriority && matchesSearch;
    });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const pendingTasks = tasks.filter((task) => task.status === "todo").length;
    const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;

    const progress =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const chartData = [
        { name: "Todo", value: pendingTasks },
        { name: "In Progress", value: inProgressTasks },
        { name: "Done", value: completedTasks },
    ];

    const COLORS = ["#facc15", "#60a5fa", "#22c55e"];
    return (
        <div className={darkMode ? "min-h-screen bg-gray-900 text-white p-8" : "min-h-screen bg-gray-100 text-gray-900 p-8"}>
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white"
                >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-blue-700">
                    Team Task Manager
                </h1>

                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
                <div className={darkMode ? "bg-gray-800 rounded-xl shadow-md p-5" : "bg-white rounded-xl shadow-md p-5"}>
                    <h2 className="text-lg font-semibold">Total Tasks</h2>
                    <p className="text-3xl font-bold text-blue-600">
                        {stats.totalTasks || 0}
                    </p>
                </div>

                <div className={darkMode ? "bg-gray-800 rounded-xl shadow-md p-5" : "bg-white rounded-xl shadow-md p-5"}>
                    <h2 className="text-lg font-semibold">Completed</h2>
                    <p className="text-3xl font-bold text-green-600">
                        {stats.completedTasks || 0}
                    </p>
                </div>

                <div className={darkMode ? "bg-gray-800 rounded-xl shadow-md p-5" : "bg-white rounded-xl shadow-md p-5"}>
                    <h2 className="text-lg font-semibold">Pending</h2>
                    <p className="text-3xl font-bold text-yellow-500">
                        {stats.pendingTasks || 0}
                    </p>
                </div>

                <div className={darkMode ? "bg-gray-800 rounded-xl shadow-md p-5" : "bg-white rounded-xl shadow-md p-5"}>
                    <h2 className="text-lg font-semibold">In Progress</h2>
                    <p className="text-3xl font-bold text-purple-600">
                        {stats.inProgressTasks || 0}
                    </p>
                </div>

                <div className={darkMode ? "bg-gray-800 rounded-xl shadow-md p-5" : "bg-white rounded-xl shadow-md p-5"}>
                    <h2 className="text-lg font-semibold">Overdue</h2>
                    <p className="text-3xl font-bold text-red-500">
                        {stats.overdueTasks || 0}
                    </p>
                </div>
            </div>

            {/* Forms */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">

                {/* Create Project */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4">
                        Create Project
                    </h2>

                    <form onSubmit={createProject} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Project Title"
                            value={projectData.title}
                            onChange={handleProjectChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <textarea
                            name="description"
                            placeholder="Project Description"
                            value={projectData.description}
                            onChange={handleProjectChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                            Create Project
                        </button>
                    </form>
                </div>

                {/* Create Task */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4">
                        Create Task
                    </h2>

                    <form onSubmit={createTask} className="space-y-4">

                        <input
                            type="text"
                            name="title"
                            placeholder="Task Title"
                            value={taskData.title}
                            onChange={handleTaskChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <textarea
                            name="description"
                            placeholder="Task Description"
                            value={taskData.description}
                            onChange={handleTaskChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <select
                            name="project"
                            value={taskData.project}
                            onChange={handleTaskChange}
                            className="w-full border p-3 rounded-lg"
                        >
                            <option value="">Select Project</option>

                            {projects.map((project) => (
                                <option
                                    key={project._id}
                                    value={project._id}
                                >
                                    {project.title}
                                </option>
                            ))}
                        </select>

                        <select
                            name="assignedTo"
                            value={taskData.assignedTo}
                            onChange={handleTaskChange}
                            className="w-full border p-3 rounded-lg"
                        >
                            <option value="">Assign Member</option>

                            {users.map((user) => (
                                <option
                                    key={user._id}
                                    value={user._id}
                                >
                                    {user.name} ({user.role})
                                </option>
                            ))}
                        </select>

                        <select
                            name="priority"
                            value={taskData.priority}
                            onChange={handleTaskChange}
                            className="w-full border p-3 rounded-lg"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <input
                            type="date"
                            name="dueDate"
                            value={taskData.dueDate}
                            onChange={handleTaskChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        <input
                            type="file"
                            name="attachment"
                            onChange={handleTaskChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
                            Create Task
                        </button>

                    </form>
                </div>
            </div>

            {/* Projects */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-5">
                    Projects
                </h2>
                <div className={darkMode ? "bg-gray-800 p-5 rounded-xl shadow-md mb-6" : "bg-white p-5 rounded-xl shadow-md mb-6"}>
                    <h2 className="text-xl font-bold mb-4">Task Status Analytics</h2>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-white p-5 rounded-xl shadow-md"
                        >
                            <h3 className="text-2xl font-semibold">
                                {project.title}
                            </h3>

                            <p className="text-gray-600 mt-2">
                                {project.description}
                            </p>
                            <button
                                onClick={() => deleteProject(project._id)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Delete Project
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tasks */}
            <div>

                <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <h2 className="text-3xl font-bold">Tasks</h2>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border p-2 rounded-lg w-64"
                    />
                    <div className="flex gap-3"></div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border p-2 rounded-lg"
                    >
                        <option value="all">All Tasks</option>
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border p-2 rounded-lg"
                    >
                        <option value="all">All Tasks</option>
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>

                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="border p-2 rounded-lg"
                    >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="grid md:grid-cols-4 gap-5 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-600">Total Tasks</h2>
                        <p className="text-3xl font-bold mt-2">{totalTasks}</p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-600">Completed</h2>
                        <p className="text-3xl font-bold mt-2">{completedTasks}</p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-600">Pending</h2>
                        <p className="text-3xl font-bold mt-2">{pendingTasks}</p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-600">Progress</h2>
                        <p className="text-3xl font-bold mt-2">{progress}%</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                    {filteredTasks.map((task) => (
                        <div
                            key={task._id}
                            className="bg-white p-5 rounded-xl shadow-md"
                        >
                            <h3 className="text-2xl font-semibold">
                                {task.title}
                            </h3>

                            <p className="text-gray-600 mt-2">
                                {task.description}
                            </p>

                            <div className="mt-4 space-y-1">

                                <p>
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span
                                        className={
                                            task.status === "done"
                                                ? "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold"
                                                : task.status === "in-progress"
                                                    ? "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold"
                                                    : "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold"
                                        }
                                    >
                                        {task.status}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-semibold">Priority:</span>{" "}
                                    <span
                                        className={
                                            task.priority === "high"
                                                ? "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold"
                                                : task.priority === "medium"
                                                    ? "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold"
                                                    : "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold"
                                        }
                                    >
                                        {task.priority}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-semibold">
                                        Project:
                                    </span>{" "}
                                    {task.project?.title}
                                </p>


                                <div className="flex items-center gap-3">
                                    <span className="font-semibold">Assigned To:</span>

                                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {task.assignedTo?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>

                                    <span>{task.assignedTo?.name || "Unassigned"}</span>
                                </div>
                                {task.attachment && (
                                    <p>
                                        <span className="font-semibold">Attachment:</span>{" "}
                                        <a
                                            href={`http://localhost:5000/uploads/${task.attachment}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View File
                                        </a>
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex gap-3">

                                <select
                                    value={task.status}
                                    onChange={(e) =>
                                        updateTaskStatus(
                                            task._id,
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded-lg"
                                >
                                    <option value="todo">Todo</option>
                                    <option value="in-progress">
                                        In Progress
                                    </option>
                                    <option value="done">Done</option>
                                </select>

                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}

export default Dashboard;