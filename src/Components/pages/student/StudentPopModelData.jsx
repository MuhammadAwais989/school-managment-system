const StudentInputData = [
  { name: 'name', type: 'text', placeholder: 'Student Name' },
  { name: 'fatherName', type: 'text', placeholder: 'Father Name' },
  { name: 'motherName', type: 'text', placeholder: 'Mother Name' },
  { name: 'fatherOccupation', type: 'text', placeholder: 'Father Occupation' },
  {
    name: 'gender',
    type: 'select',
    placeholder: 'Select Gender',
    options: ['Male', 'Female', 'Other'],
  },
  { name: 'dateOfJoining', type: 'text', placeholder: 'Date of Joining' },
  { name: 'Class', type: 'text', placeholder: 'Class' },
  { name: 'section', type: 'text', placeholder: 'Section' },
  { name: 'Fees', type: 'text', placeholder: 'Fees' },
  { name: 'dateOfBirth', type: 'text', placeholder: 'Date of Birth' },
  { name: 'age', type: 'text', placeholder: 'Age' },
  { name: 'religion', type: 'text', placeholder: 'Religion' },
  { name: 'presentAddress', type: 'text', placeholder: 'Present Address' },
  { name: 'permanentAddress', type: 'text', placeholder: 'Permanent Address' },
  { name: 'phone', type: 'text', placeholder: 'Phone Number', length: 11 },
  { name: 'CNIC_No', type: 'text', placeholder: 'CNIC / B-Form Number' },
];

export default StudentInputData;