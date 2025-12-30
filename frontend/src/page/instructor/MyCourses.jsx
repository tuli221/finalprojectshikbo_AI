import axios from "axios";
import { useEffect, useState } from "react";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/my-courses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
      }
    })
    .then(res => {
      setCourses(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching courses:", err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold">My Assigned Courses</h3>
          <p className="text-gray-600 text-sm mt-1">Courses assigned to you by the admin</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <i className="fa-solid fa-book-open text-5xl text-gray-300"></i>
          </div>
          <p className="text-gray-600 mb-2 font-semibold">No courses have been assigned to you yet.</p>
          <p className="text-gray-500 text-sm">Contact the administrator to get courses assigned to your profile.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">{course.title}</div>
                    <div className="text-xs text-gray-500 truncate">{course.short_description || ''}</div>
                  </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{course.category}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{course.enrolled_count || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{course.rating || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{course.lessons || 0}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">${course.price}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`px-2 py-1 text-xs rounded ${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyCourses
      

     