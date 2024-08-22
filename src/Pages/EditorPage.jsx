import React, { useState } from 'react';
import {
  FiFileText,
  FiMessageSquare,
  FiPlay,
  FiUsers,
  FiSettings,
  FiPenTool,
} from 'react-icons/fi';
import { Editor } from '../components';
const EditorPage = () => {
  const [clients, setClients] = useState([
    { socketId: 1, username: 'Rampal Yadav' },
    { socketId: 2, username: 'John Doe' },
  ]);

  return (
    <div className='bg-gray-900 w-screen h-screen text-white flex'>
      {/* Sidebar */}
      <div className='w-12 bg-gray-800 p-4 flex flex-col items-center space-y-8'>
        <FiFileText className='w-6 h-6 cursor-pointer hover:text-gray-400' />
        <FiMessageSquare className='w-6 h-6 cursor-pointer hover:text-gray-400' />
        <FiPlay className='w-6 h-6 cursor-pointer hover:text-gray-400' />
        <FiUsers className='w-6 h-6 cursor-pointer hover:text-gray-400' />
        <FiSettings className='w-6 h-6 cursor-pointer hover:text-gray-400' />
        <FiPenTool className='w-6 h-6 cursor-pointer hover:text-gray-400' />
      </div>

      {/* Users List and Actions */}
      <div className='w-80 bg-gray-800 p-4 flex flex-col'>
        <h1 className='text-2xl font-bold'>CodeShare</h1>
        <p className='mt-1 text-gray-400'>A real-time code sharing platform</p>
        <div className='bg-gray-400 h-[2px] mt-2 w-full'></div>

        <h2 className='text-lg font-bold mt-4'>Users</h2>
        <div className='mt-4 space-y-4'>
          {clients.map(client => (
            <div key={client.socketId} className='flex items-center space-x-3'>
              <div className='relative'>
                <div className='w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold'>
                  {client.username.charAt(0)}
                </div>
                <span className='absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800'></span>
              </div>
              <span>{client.username}</span>
            </div>
          ))}
        </div>

        <div className='flex flex-col mt-auto'>
          <div className='flex space-x-4'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300'>
              Copy Room ID
            </button>
            <button className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300'>
              Leave
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-grow bg-gray-700 p-4'>
        <div className='bg-gray-800 h-full rounded-lg p-4'>
          <Editor />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
