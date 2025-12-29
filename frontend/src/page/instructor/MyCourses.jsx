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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gray-200">
                {course.thumbnail ? (
                  <img 
                    src={`http://localhost:8000/storage/${course.thumbnail}`} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-800 line-clamp-2">{course.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ml-2 ${
                    course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{course.category}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-users"></i>
                    <span>{course.enrolled_count || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-yellow-500"></i>
                    <span>{course.rating || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-book"></i>
                    <span>{course.lessons || 0} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-dollar-sign"></i>
                    <span>${course.price}</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
                  <i className="fa-solid fa-info-circle mr-1"></i>
                  This course is managed by the admin
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses
      

     