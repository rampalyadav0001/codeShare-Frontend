import React, { useEffect } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
const Editor = () => {
  useEffect(() => {
    const editor = CodeMirror.fromTextArea(document.getElementById('realTimeEditor'), {
      lineNumbers: true,
      theme: 'dracula',
      mode: 'javascript',
      autoCloseTags: true,
      autoCloseBrackets: true,
    });
    editor.setSize('100%', '100%');
    return () => {
      editor.toTextArea();
    };
  }, []);
  return (
    <textarea
      id='realTimeEditor'
      className='w-full h-full bg-gray-800 text-white p-4 text-sm outline-none'
      placeholder='Write your code here...'
    ></textarea>
  );
};

export default Editor;
