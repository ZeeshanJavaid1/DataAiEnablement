import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCourse, getCourses, addCourseEnrollment, updateEnrolledUserStatus,deleteCourseApi,updateCourseApi } from "../../api/apiService"; // 👈 Make sure getCourses is implemented

// 🔹 Thunk: create new course
export const createNewCourse = createAsyncThunk(
  "course/createNewCourse",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await addCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create course");
    }
  }
);

// Add these thunks to your existing CourseSlice

export const deleteCourse = createAsyncThunk(
  'course/delete',
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await deleteCourseApi(courseId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'course/update',
  async ({ courseId, data }, { rejectWithValue }) => {
    try {
      const response = await updateCourseApi(courseId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Thunk: fetch all courses

export const enrollInCourse = createAsyncThunk(
  "course/enrollInCourse",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      debugger
      const response = await addCourseEnrollment(formData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Enrollment failed");
    }
  }
);

// 🔹 Thunk: update enrollment data
export const updateEnrolledUser = createAsyncThunk(
  "course/updateEnrolledUser",  // ✅ Changed this line
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await updateEnrolledUserStatus(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Enrollment update failed");
    }
  }
);



// 🔹 Thunk: fetch all courses
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      debugger
      const response = await getCourses(); // Must return an array of courses
      debugger
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch courses");
    }
  }
);

// 🔧 Slice definition
const CourseSlice = createSlice({
  name: "course",
  initialState: {
    loading: false,
    success: false,
    error: null,
    courses: [], // 👈 store fetched courses
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📌 Create Course
      .addCase(createNewCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createNewCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 📌 Update Course
.addCase(updateCourse.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateCourse.fulfilled, (state) => {
  state.loading = false;
  state.success = true;
})
.addCase(updateCourse.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

// 📌 Delete Course
.addCase(deleteCourse.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deleteCourse.fulfilled, (state, action) => {
  state.loading = false;
  state.success = true;

  // Remove the deleted course from the list
  const deletedId = action.meta.arg.courseId;
  state.courses = state.courses.filter(course => course.Id !== deletedId);
})
.addCase(deleteCourse.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
      // 📌 enroll in Courses
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 📌update enrollment 
      .addCase(updateEnrolledUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEnrolledUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateEnrolledUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 📌 Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload; // ✅ populate courses
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = CourseSlice.actions;
export default CourseSlice.reducer;
