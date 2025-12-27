import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

const HexLetters = forwardRef(({letters}, ref) => {
    const centralLetterRef = useRef(null);

    useEffect(() => {
        const hexes = document.querySelectorAll('.hex');
        hexes.forEach((hex, i) => {
            hex.textContent = letters[i];
        });
    }, [letters])
    
    
    useImperativeHandle(ref, () => ({
        getLetter: () => {
            return centralLetterRef.current?.textContent;
        },
    }));

  return (
    <>
        <div className="cursor-pointer select-none hex hex-shape w-23 h-20 bg-gray-300 absolute top-[23%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl font-bold"/>

        <div className="cursor-pointer select-none hex hex-shape w-23 h-20 bg-gray-300 absolute top-[37%] left-[26%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl font-bold"/>

        <div className="cursor-pointer select-none hex hex-shape w-23 h-20 bg-gray-300 absolute top-[37%] left-[74%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl font-bold"/>

        <div ref={centralLetterRef} className="central cursor-pointer select-none hex hex-shape w-23 h-20 bg-yellow-400 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl font-bold"/>

        <div className="cursor-pointer select-none hex hex-shape w-23 h-20 bg-gray-300 absolute top-[64%] left-[26%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl font-bold"/>

        <div className="cursor-pointer select-none hex hex-shape w-23 h-20 bg-gray-300 absolute top-[64%] left-[74%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl font-bold"/>
        
        <div className="cursor-pointer select-none hex hex-shape w-23 h-20 bg-gray-300 absolute top-[77%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl font-bold"/>
    </>
  )
});

export default HexLetters