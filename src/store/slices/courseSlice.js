import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchCourses = createAsyncThunk("courses/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/courses", { params });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
  }
});

export const fetchCourseById = createAsyncThunk("courses/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/courses/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch course");
  }
});

export const createCourse = createAsyncThunk("courses/create", async (courseData, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/courses", courseData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create course");
  }
});

export const enrollCourse = createAsyncThunk("courses/enroll", async (courseId, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`/courses/${courseId}/enroll`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to enroll");
  }
});

export const fetchModules = createAsyncThunk("courses/fetchModules", async (courseId, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/courses/${courseId}/modules`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch modules");
  }
});

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    currentCourse: null,
    modules: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCourseError: (state) => { state.error = null; },
    clearCurrentCourse: (state) => { state.currentCourse = null; state.modules = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.courses = action.payload; })
      .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCourseById.pending, (state) => { state.loading = true; })
      .addCase(fetchCourseById.fulfilled, (state, action) => { state.loading = false; state.currentCourse = action.payload; })
      .addCase(fetchCourseById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createCourse.fulfilled, (state, action) => { state.courses.push(action.payload); })
      .addCase(fetchModules.fulfilled, (state, action) => { state.modules = action.payload; });
  },
});

export const { clearCourseError, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
