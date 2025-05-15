import { useState } from 'react';
import axios from 'axios';

function AddSubject() {
  const [form, setForm] = useState({
    name: '', code: '', department: '', year: '', semester: '', type: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/subjects', form);
    alert('Subject added!');
    setForm({ name: '', code: '', department: '', year: '', semester: '', type: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Add Subject</h2>
      <label htmlFor="name" className="font-bold">
                    Name:
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.name}
                    type="text"
                    id="name"
                    className="outline-none border-b mb-6"
                  />
                   <label htmlFor="name" className="font-bold">
                    Code:
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.code}
                    type="text"
                    id="name"
                    className="outline-none border-b mb-6"
                  />
                  <label htmlFor="Class" className="font-bold">
                    Select Department:
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="outline-none mb-6 border"
                  >
                    <option value="">--Select--</option>
                    <option value="IT">IT</option>
                    <option value="Other">Other</option>
                  </select>
                  <label className="font-bold">Year:</label>
<select
  id="year"
  value={formData.year}
  onChange={handleChange}
  className="outline-none mb-4 border"
>
  <option value="">--Select Year--</option>
  <option value="1st">1st</option>
  <option value="2nd">2nd</option>
  <option value="3rd">3rd</option>
  <option value="4th">4th</option>
</select>
<label className="font-bold">Section:</label>
<select
  id="section"
  value={formData.section}
  onChange={handleChange}
  className="outline-none mb-4 border"
>
  <option value="">--Select Section--</option>
  <option value="A">A</option>
  <option value="B">B</option>
  <option value="C">C</option>
</select>
<label className="font-bold">Semester:</label>
<select
  id="semester"
  value={formData.semester}
  onChange={handleChange}
  className="outline-none mb-4 border"
>
  <option value="">--Select Semester--</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
</select>
      <input name="semester" value={form.semester} onChange={handleChange} placeholder="Semester" type="number" required className="w-full mb-2 p-2 border rounded" />
      <select
  name="type"
  value={form.type}
  onChange={handleChange}
  required
  className="w-full mb-2 p-2 border rounded"
>
  <option value="">Select Type</option>
  <option value="Theory">Theory</option>
  <option value="Practical">Practical</option>
</select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Subject</button>
    </form>
  );
}

export default AddSubject;
