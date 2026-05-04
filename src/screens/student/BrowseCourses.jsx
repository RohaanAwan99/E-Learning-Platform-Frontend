import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';
import Navbar from '../../components/navbar';
import './BrowseCourses.css';

export default function BrowseCourses() {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((s) => s.courses);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const params = { isPublished: true };
    if (search) params.search = search;
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    dispatch(fetchCourses(params));
  }, [dispatch, search, category, difficulty]);

  const categories = ['development', 'science', 'business', 'design', 'marketing'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const colors = { development: '#2563eb', science: '#0f766e', business: '#f59e0b', design: '#9333ea', marketing: '#ef4444' };

  return (
    <>
      <Navbar />
      <div className="browse-wrapper">
        <div className="browse-header">
          <h1>Explore Courses</h1>
          <p>Discover courses across all disciplines.</p>
        </div>
        <div className="browse-filters">
          <input type="text" placeholder="Search courses..." className="browse-search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="browse-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select className="browse-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All Levels</option>
            {difficulties.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
        </div>
        <div className="browse-grid">
          {loading ? <p className="browse-loading">Loading courses...</p> :
            courses?.length === 0 ? <p className="browse-loading">No courses found.</p> :
            (courses || []).map((course) => (
              <Link to={`/courses/${course._id}`} key={course._id} className="browse-card">
                <div className="browse-card-header" style={{ background: colors[course.category] || '#2563eb' }}>
                  <span className="browse-card-cat">{course.category}</span>
                  <span className="browse-card-diff">{course.difficulty}</span>
                </div>
                <div className="browse-card-body">
                  <h3>{course.title}</h3>
                  <p>{course.description?.slice(0, 100)}...</p>
                  <div className="browse-card-footer">
                    <span>👤 {course.instructor?.name || 'Instructor'}</span>
                    <span>📚 {course.totalEnrolments || 0} enrolled</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

