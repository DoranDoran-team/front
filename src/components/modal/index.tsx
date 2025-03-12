import React, { useRef } from 'react';
import './style.css';

// interface: modal Props
interface modalProps {
    content: string | null;
    lt_btn: string;
    rt_btn: string;
    lt_handler: () => void;
    rt_handler: () => void;
    modalOpen: boolean; // 모달이 열려있는지 확인하는 prop
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // 모달 상태 변경 함수
}

export default function Modal({ content, lt_btn, rt_btn, lt_handler, rt_handler, modalOpen, setModalOpen }: modalProps): JSX.Element | null {
    const modalBackground = useRef<HTMLDivElement>(null);

    // 모달 외부를 클릭했을 때 모달 닫기
    const handleOutsideClick = (e: React.MouseEvent) => {
        if (modalBackground.current && e.target === modalBackground.current) {
            setModalOpen(false); // 모달 외부 클릭 시 모달을 닫는다.
        }
    };

    if (!modalOpen) return null; // 모달이 열려있지 않으면 null을 반환

    return (
        <div
            className="modal-wrapper"
            ref={modalBackground}
            onClick={handleOutsideClick} // 모달 외부 클릭 이벤트 처리
        >
            <div className="modal-box">
                <div className="modal-content">{content}</div>
                <div className="modal-button-box">
                    <div className="modal-button" onClick={rt_handler}>
                        {rt_btn}
                    </div>
                    <div className="modal-button" onClick={lt_handler}>
                        {lt_btn}
                    </div>
                </div>
            </div>
        </div>
    );
}
