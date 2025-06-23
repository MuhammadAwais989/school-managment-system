import React from 'react';

const TableComponent = ({ data }) => {
  return (
    <div className="overflow-x-auto max-h-[calc(100vh-255px)] scrollbar-hide">
      <table className="min-w-full table-auto bg-white border border-gray-300 ">
        <thead className="bg-gray-100 text-gray-700">
          <tr className="text-sm font-semibold text-center w-fit">
            <th className="border px-3 py-3 whitespace-nowrap"></th>
            <th className="border px-3 py-3 whitespace-nowrap">Photo</th>
            <th className="border px-3 py-3 whitespace-nowrap">Name</th>
            <th className="border px-3 py-3 whitespace-nowrap">Father Name</th>
            <th className="border px-3 py-3 whitespace-nowrap">Designation</th>
            <th className="border px-3 py-3 whitespace-nowrap">Date of Joining</th>
            <th className="border px-3 py-3 whitespace-nowrap">Class</th>
            <th className="border px-3 py-3 whitespace-nowrap">Section</th>
            <th className="border px-3 py-3 whitespace-nowrap">Gender</th>
            <th className="border px-3 py-3 whitespace-nowrap">Date of Birth</th>
            <th className="border px-3 py-3 whitespace-nowrap">Phone</th>
            <th className="border px-3 py-3 whitespace-nowrap">Email</th>
            <th className="border px-3 py-3 whitespace-nowrap">Password</th>
            <th className="border px-3 py-3 whitespace-nowrap">Address</th>
          </tr>
        </thead>
        <tbody className='overflow-auto'>
          {data?.map((item, index) => (
            <tr 
              key={index} 
              className={`text-center text-sm hover:bg-gray-50 transition ${
                index % 2 === 1 ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <td className="border px-3 py-1 text-gray-400">{index + 1}</td>
              <td className="border px-3 py-1">
                <img
                  src={item.profilePic}
                  alt="Profile"
                  className="h-10 w-10 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.name}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.fatherName}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.designation}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.dateOfJoining}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.Class}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.section}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.gender}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.dateOfBirth}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.phone}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.email}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.password}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;