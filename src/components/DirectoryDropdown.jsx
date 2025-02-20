import React from 'react';

const DirectoryDropdown = () => {
  return (
    <div className="w-full max-w-md mb-6">
      <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Current Directory</option>
        <option>Directory 1</option>
        <option>Directory 2</option>
      </select>
    </div>
  );
};

export default DirectoryDropdown;