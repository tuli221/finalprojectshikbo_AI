import api from './api';

export const courseApi = {
    //Get all courses
    getAllCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },
    // Create a new course
    createCourse: async (courseData) => {
        const formData = new FormData()
        //Add all fields to formData
        Object.keys(courseData).forEach(key => {
            if (courseData[key] !== null) {
                formData.append(key, courseData[key])
            }
        })
        const response = await api.post('/courses', formData);
        return response;
    },
    //Get single course
    getCourse: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },
    //Update course
    updateCourse: async (id, courseData) => {
        const formData = new FormData()
        Object.keys(courseData).forEach(key => {
            if (courseData[key] !== null) {
                formData.append(key, courseData[key])
            }
        })
        const response = await api.put(`/courses/${id}`, formData)
        return response
    },
    //Delete course
    deleteCourse: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },
    // Get instructor's courses
    getMycourses: async () => {
        const response = await api.get('/my-courses')
        return response.data
    }

}
 export default courseApi