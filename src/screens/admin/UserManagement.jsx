import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadUsers = async (page = 1) => {
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await API.get('/admin/users', { params });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadUsers(); }, [search, roleFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try { await API.delete(`/admin/users/${id}`); toast.success('User deleted'); loadUsers(pagination.page); } catch (err) { toast.error('Failed'); }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'student' ? 'teacher' : 'student';
    try { await API.put(`/admin/users/${id}`, { role: newRole }); toast.success('Role updated'); loadUsers(pagination.page); } catch (err) { toast.error('Failed'); }
  };

  const inputStyle = { padding: '0.6rem 1rem', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' };

  return (
    <><Navbar />
      <div style={{maxWidth:'1000px',margin:'2rem auto',padding:'0 2rem'}}>
        <h1 style={{fontSize:'1.6rem',color:'#1a1a2e'}}>User Management</h1>
        <div style={{display:'flex',gap:'1rem',margin:'1.5rem 0',flexWrap:'wrap'}}>
          <input style={{...inputStyle, flex:1, minWidth:'200px'}} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={inputStyle} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option>
          </select>
        </div>
        <div style={{background:'#fff',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.88rem'}}>
            <thead><tr style={{background:'#f8f9ff',textAlign:'left'}}><th style={{padding:'0.85rem 1rem'}}>Name</th><th style={{padding:'0.85rem'}}>Email</th><th style={{padding:'0.85rem'}}>Role</th><th style={{padding:'0.85rem'}}>Joined</th><th style={{padding:'0.85rem'}}>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{borderBottom:'1px solid #f0f0f0'}}>
                  <td style={{padding:'0.85rem 1rem',fontWeight:600}}>{u.name}</td>
                  <td style={{padding:'0.85rem',color:'#666'}}>{u.email}</td>
                  <td style={{padding:'0.85rem'}}><span style={{background:u.role==='admin'?'#fef3c7':u.role==='teacher'?'#dbeafe':'#dcfce7',padding:'0.2rem 0.6rem',borderRadius:'20px',fontSize:'0.75rem',fontWeight:600}}>{u.role}</span></td>
                  <td style={{padding:'0.85rem',color:'#888',fontSize:'0.82rem'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{padding:'0.85rem'}}>
                    {u.role !== 'admin' && <><button onClick={() => toggleRole(u._id, u.role)} style={{color:'#6366f1',background:'none',border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:600,marginRight:'0.75rem'}}>Change Role</button><button onClick={() => handleDelete(u._id)} style={{color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:600}}>Delete</button></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div style={{display:'flex',justifyContent:'center',gap:'0.5rem',marginTop:'1.5rem'}}>
            {Array.from({length: pagination.pages}, (_, i) => (
              <button key={i} onClick={() => loadUsers(i + 1)} style={{padding:'0.5rem 0.85rem',borderRadius:'8px',border:'none',background: pagination.page === i+1 ? '#6366f1':'#f0f0f0',color: pagination.page === i+1 ? '#fff':'#333',cursor:'pointer',fontWeight:600}}>{i+1}</button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
