import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    duration: "",
    level: "Beginner",
    price: "",
    discount_price: "",
    lessons: "",
    status: "Draft"
  });
  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('duration', form.duration);
    formData.append('level', form.level);
    formData.append('price', form.price);
    formData.append('discount_price', form.discount_price || '');
    formData.append('lessons', form.lessons);
    formData.append('status', form.status);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      await axios.post("http://localhost:8000/api/courses", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate("/instructor/my-courses");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Create Course</h2>

      <input name="title" value={form.title} onChange={handleChange}
        placeholder="Course Title" className="w-full p-3 mb-3 border rounded" required />

      <input name="category" value={form.category} onChange={handleChange}
        placeholder="Category" className="w-full p-3 mb-3 border rounded" required />

      <textarea name="description" value={form.description} onChange={handleChange}
        className="w-full p-3 mb-3 border rounded" placeholder="Description" required />

      <input type="number" name="duration" value={form.duration} onChange={handleChange}
        placeholder="Duration (in hours)" className="w-full p-3 mb-3 border rounded" required />

      <input type="number" name="price" value={form.price} onChange={handleChange}
        placeholder="Price" className="w-full p-3 mb-3 border rounded" required />

      <input type="number" name="discount_price" value={form.discount_price} onChange={handleChange}
        placeholder="Discount Price (optional)" className="w-full p-3 mb-3 border rounded" />

      <input type="number" name="lessons" value={form.lessons} onChange={handleChange}
        placeholder="Number of Lessons" className="w-full p-3 mb-3 border rounded" required />

      <select name="level" value={form.level} onChange={handleChange}
        className="w-full p-3 border rounded mb-3">
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select name="status" value={form.status} onChange={handleChange}
        className="w-full p-3 border rounded mb-3">
        <option value="Draft">Draft</option>
        <option value="Published">Published</option>
      </select>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-medium">Thumbnail Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange}
          className="w-full p-2 border rounded" />
      </div>

      <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
        Create Course
      </button>
    </form>
  );
};

export default CreateCourse;
