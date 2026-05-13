import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
    const [stats, setStats] = useState({});
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

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
    });

    useEffect(() => {
        fetchDashboard();
        fetchProjects();
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchDashboard = async () => {
        const res = await API.get("/dashboard");
        setStats(res.data);
    };

    const fetchProjects = async () => {
        const res = await API.get("/projects");
        setProjects(res.data);
    };

    const fetchTasks = async () => {
        const res = await API.get("/tasks");
        setTasks(res.data);
    };
    const fetchUsers = async () => {
        const res = await API.get("/users");
        setUsers(res.data);
    };

    const handleProjectChange = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTaskChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value,
        });
    };

    const createProject = async (e) => {
        e.preventDefault();

        await API.post("/projects", projectData);

        fetchProjects();

        setProjectData({
            title: "",
            description: "",
        });
    };

    const createTask = async (e) => {
        e.preventDefault();

        await API.post("/tasks", taskData);

        fetchTasks();
        fetchDashboard();

        setTaskData({
            title: "",
            description: "",
            project: "",
            priority: "medium",
            dueDate: "",
        });
    };

    const updateTaskStatus = async (taskId, status) => {
        await API.put(`/tasks/${taskId}`, { status });

        fetchTasks();
        fetchDashboard();
    };

    const deleteTask = async (taskId) => {
        await API.delete(`/tasks/${taskId}`);

        fetchTasks();
        fetchDashboard();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
                Team Task Manager
            </h1>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-lg font-semibold">Total Tasks</h2>
                    <p className="text-3xl font-bold text-blue-600">
                        {stats.totalTasks || 0}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-lg font-semibold">Completed</h2>
                    <p className="text-3xl font-bold text-green-600">
                        {stats.completedTasks || 0}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-lg font-semibold">Pending</h2>
                    <p className="text-3xl font-bold text-yellow-500">
                        {stats.pendingTasks || 0}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-lg font-semibold">In Progress</h2>
                    <p className="text-3xl font-bold text-purple-600">
                        {stats.inProgressTasks || 0}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-5">
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
                    <h2 className="text-2xl font-bold mb-4">Create Project</h2>

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
                    <h2 className="text-2xl font-bold mb-4">Create Task</h2>

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
                                <option key={project._id} value={project._id}>
                                    {project.title}
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

                        <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
                            Create Task
                        </button>
                    </form>
                </div>
            </div>

            {/* Projects */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-5">Projects</h2>

                <div className="grid md:grid-cols-2 gap-5">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-white p-5 rounded-xl shadow-md"
                        >
                            <h3 className="text-2xl font-semibold">{project.title}</h3>
                            <p className="text-gray-600 mt-2">{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <select
                name="assignedTo"
                value={taskData.assignedTo}
                onChange={handleTaskChange}
                className="w-full border p-3 rounded-lg"
            >
                <option value="">Assign Member</option>

                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.name} ({user.role})
                    </option>
                ))}
            </select>
            {/* Tasks */}
            <div>
                <h2 className="text-3xl font-bold mb-5">Tasks</h2>

                <div className="grid md:grid-cols-2 gap-5">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="bg-white p-5 rounded-xl shadow-md"
                        >
                            <h3 className="text-2xl font-semibold">{task.title}</h3>

                            <p className="text-gray-600 mt-2">{task.description}</p>

                            <div className="mt-4 space-y-1">
                                <p>
                                    <span className="font-semibold">Status:</span>{" "}
                                    {task.status}
                                </p>

                                <p>
                                    <span className="font-semibold">Priority:</span>{" "}
                                    {task.priority}
                                </p>

                                <p>
                                    <span className="font-semibold">Project:</span>{" "}
                                    {task.project?.title}
                                </p>
                                <p>
                                    <span className="font-semibold">Assigned To:</span>{" "}
                                    {task.assignedTo?.name}
                                </p>

                                <p>
                                    <span className="font-semibold">Due Date:</span>{" "}
                                    {task.dueDate?.slice(0, 10)}
                                </p>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <select
                                    value={task.status}
                                    onChange={(e) =>
                                        updateTaskStatus(task._id, e.target.value)
                                    }
                                    className="border p-2 rounded-lg"
                                >
                                    <option value="todo">Todo</option>
                                    <option value="in-progress">In Progress</option>
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