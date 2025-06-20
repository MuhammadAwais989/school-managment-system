import React from 'react';

const TableComponent = ({ data }) => {
  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full table-auto bg-white border border-gray-300 ">
        <thead className="bg-gray-200 text-gray-700">
          <tr className="text-sm font-semibold text-left">
            <th className="border px-3 py-2 whitespace-nowrap">#</th>
            <th className="border px-3 py-2 whitespace-nowrap">Photo</th>
            <th className="border px-3 py-2 whitespace-nowrap">Name</th>
            <th className="border px-3 py-2 whitespace-nowrap">Father Name</th>
            <th className="border px-3 py-2 whitespace-nowrap">Designation</th>
            <th className="border px-3 py-2 whitespace-nowrap">Date of Joining</th>
            <th className="border px-3 py-2 whitespace-nowrap">Class</th>
            <th className="border px-3 py-2 whitespace-nowrap">Section</th>
            <th className="border px-3 py-2 whitespace-nowrap">Gender</th>
            <th className="border px-3 py-2 whitespace-nowrap">Date of Birth</th>
            <th className="border px-3 py-2 whitespace-nowrap">Phone</th>
            <th className="border px-3 py-2 whitespace-nowrap">Email</th>
            <th className="border px-3 py-2 whitespace-nowrap">Password</th>
            <th className="border px-3 py-2 whitespace-nowrap">Address</th>
          </tr>
        </thead>
        <tbody >
          {data?.map((item, index) => (
            <tr key={index} className="text-center text-sm hover:bg-gray-50 transition ">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">
                <img
                  src={item.photo || 'https://via.placeholder.com/50'}
                  alt="Profile"
                  className="h-10 w-10 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="border px-3 py-2">{item.name}</td>
              <td className="border px-3 py-2">{item.fatherName}</td>
              <td className="border px-3 py-2">{item.designation}</td>
              <td className="border px-3 py-2">{item.dateOfJoining}</td>
              <td className="border px-3 py-2">{item.Class}</td>
              <td className="border px-3 py-2">{item.section}</td>
              <td className="border px-3 py-2">{item.gender}</td>
              <td className="border px-3 py-2">{item.dateOfBirth}</td>
              <td className="border px-3 py-2">{item.phone}</td>
              <td className="border px-3 py-2 truncate max-w-[180px]">{item.email}</td>
              <td className="border px-3 py-2 truncate max-w-[120px]">{item.password}</td>
              <td className="border px-3 py-2 break-words max-w-[200px]">{item.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
