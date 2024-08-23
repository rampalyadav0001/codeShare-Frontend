import React, { useEffect, useState, useRef } from 'react';
import { initSocket } from '../socket';
import { Actions } from '../Actions';
import {
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from 'react-router-dom';
import {
  FiFileText,
  FiMessageSquare,
  FiPlay,
  FiUsers,
  FiSettings,
  FiPenTool,
} from 'react-icons/fi';
import { Editor } from '../components';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const initializedRef = useRef(false);

  const handleErrors = (e) => {
    console.log('Socket failed', e);
    toast.error('Socket failed, try again');
    reactNavigator('/');
  };

  useEffect(() => {
    if (initializedRef.current) return; // Skip initialization if already done
    initializedRef.current = true; // Set lock after first initialization

    const init = async () => {
      try {
        socketRef.current = await initSocket();
        socketRef.current.on('connect', () => {
          console.log('Connected to server');
        });
        socketRef.current.on('connect_error', handleErrors);
        socketRef.current.on('connect_failed', handleErrors);
  
        socketRef.current.emit(Actions.JOIN, {
          roomId,
          username: location.state?.username,
        });

        socketRef.current.on(
          Actions.JOINED,
          ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
              toast.success(`${username} joined the room`);
            }
            setClients(clients);
            socketRef.current.emit(Actions.CODE_SYNC, { 
              socketId, 
              code: codeRef.current 
            }); 
          }
        );

        socketRef.current.on(Actions.DISCONNECTED, ({ username, socketId }) => {
          toast.success(`${username} left the room`);
          setClients((clients) =>
            clients.filter((client) => client.socketId !== socketId)
          );
        });
      } catch (error) {
        handleErrors(error);
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(Actions.JOINED);
        socketRef.current.off(Actions.DISCONNECTED);
      }
    };
  }, [roomId, location.state?.username, reactNavigator]);
  const copyRoomId=async()=>{
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard');
    } catch (error) { 
      toast.error('Failed to copy room ID');
      console.log('Failed to copy room ID', error);
    } 
  }
  const leaveRoom = () => { 
    socketRef.current.disconnect();
    reactNavigator('/');
  };

  if (!location.state) {
    return <Navigate to='/' />;
  }

  // console.log("in codeEditor page", socketRef.current);

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
          {clients.map((client) => (
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
            <button onClick={copyRoomId} className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300'>
              Copy Room ID
            </button>
            <button onClick={leaveRoom} className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300'>
              Leave
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-grow bg-gray-700 p-4'>
        <div className='bg-gray-800 h-full rounded-lg p-4'>
          {socketRef.current && (
            <Editor socketRef={socketRef.current} roomId={roomId} onCodeChange={(code)=>codeRef.current=code} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
