import React, { useEffect } from 'react';
import folderImage from '../assets/folder.jpg'; // adjust the path as needed
import { useGlobal } from '../context/GlobalContext'; // adjust the path as needed
const Folder = ({ name }) => {
    const {user,  fileSystem } = useGlobal(); // get the file system from context
    useEffect(() => {
        console.log("fileSystem", fileSystem); // log the file system when the component mounts
    }, [fileSystem]);
    const handleClick = () => {
    console.log(`Folder "${name}" was clicked!`);
    console.log("The user is", user); // log the user for the clicked folder
    console.log("this is the file system", fileSystem); // log the file system for the clicked folder
  };

  return (
    <button 
      onClick={handleClick} 
      
    >
      <img src={folderImage} alt="Folder" style={{ width: '150px', height: '150px' }} />
      <div>{name}</div>
    </button>
  );
};

export default Folder;
