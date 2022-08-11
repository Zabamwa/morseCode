import React, { useEffect, useRef, useState} from 'react';
import './App.css';
import { MorseLetter } from "./utils/const";


function App() {
    const [pressed, setPressed] = useState<boolean>(false);
    const [decode, setDecode] = useState<boolean>(false);
    const [morse, setMorse] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);
    const [text, setText] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const longPress = useRef(false);

    const decodeMorse = () => {
        const morseCode = morse.split(' ');
        setText('');
        setErrors([]);
        morseCode.forEach((code:string) => {
            if(code) {
                if (code && MorseLetter[code]) {
                    setText(prevState => prevState + MorseLetter[code]);
                } else {
                    setErrors(prevState => ([...prevState, code]))
                }
            }
        });
    };

    const codingMorse = (code:string) => {
        setMorse(prevState => prevState + code);
        longPress.current = true;
    };

    const handlePress = (key: string) => {
        setKey(key);
        setPressed(true);
    };
    useEffect(() => {
        if(key === 'Space') {
            let time: ReturnType<typeof setTimeout>;
            let letterSpace: ReturnType<typeof setTimeout>;
            if (pressed) {
                time = setTimeout(() => codingMorse('-'), 1000);
            } else {
                letterSpace = setTimeout(() => codingMorse(' '), 1000);
            }
            return () => {
                if (pressed && !longPress.current) {
                    setMorse(prevState => prevState + '.');
                }
                setDecode(true);
                clearTimeout(time);
                clearTimeout(letterSpace);
                longPress.current = false;
            }
        }
    }, [pressed, key]);

    useEffect(() => {
        if(decode){
            decodeMorse();
            setDecode(false);
        }
    }, [decode]);

    return (
    <div className="App">
      <button autoFocus={true} onKeyDown={(e) => handlePress(e.code)} onKeyUp={()=>setPressed(false)}>Press Spacebar</button>
        <p>Morse Code: {morse}</p>
        <p>Decode Text: {text}</p>
        <p>Wrong Codes: {errors.map(error => (
            `${error} , `
        ))}</p>
    </div>
  );
}

export default App;
