import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './style.css';

export default function MyCalendar() {

    const [events, setEvents] = useState<{ title: string; date: string; location?: string; description?: string; }[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<any>(null);

    const handleEventClick = (clickInfo: any) => {
        setCurrentEvent(clickInfo.event);
        setModalOpen(true);
        // alert(`이벤트: ${clickInfo.event.title}, 날짜: ${clickInfo.event.start}, locatioin: ${clickInfo.event.extendedProps.location}, description: ${clickInfo.event.extendedProps.description}`);
    };

    // component: 일정 작성 모달창 //
    function WriteDaily() {

        const [modalOpen, setModalOpen] = useState(false);
        const modalBackground = useRef<HTMLDivElement | null>(null);

        const [title, setTitle] = useState<string>('');
        const [date, setDate] = useState<string>('');
        const [location, setLocation] = useState<string>('');
        const [description, setDescription] = useState<string>('');

        const handleSave = () => {
            const newEvent = {
                title,
                date,
                location,
                description,
            };

            // 이벤트 캘린더에 추가
            setEvents(prevEvents => [
                ...prevEvents,
                { title: newEvent.title, date: newEvent.date, extendedProps: { location: newEvent.location, description: newEvent.description } }
            ]);
            console.log('저장된 이벤트:', newEvent);
            setModalOpen(false);
        };

        const handleClose = () => {
            setModalOpen(false);
        };

        return (
            <>
                <button type="submit" onClick={() => setModalOpen(true)}>일정 추가</button>
                {
                    modalOpen &&
                    <div className='modal-container' ref={modalBackground} onClick={e => {
                        if (e.target === modalBackground.current) {
                            setModalOpen(false);
                        }
                    }}>
                        <div className="event-form">
                            <h2>일정 입력</h2>
                            <div className="form-group">
                                <label>일정 제목:</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="일정 제목을 입력하세요"
                                />
                            </div>
                            <div className="form-group">
                                <label>날짜:</label>
                                <div className="date-group">
                                    <input
                                        type="datetime-local"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>링크:</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="장소를 입력하세요"
                                />
                            </div>
                            <div className="form-group">
                                <label>일정 설명:</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="일정 설명을 입력하세요"
                                />
                            </div>
                            <div className="button-group">
                                <button onClick={handleSave}>저장</button>
                                <button onClick={handleClose}>닫기</button>
                            </div>
                        </div>

                    </div>
                }
            </>
        );
    }

    // component: 일정 확인 모달창 //
    function DetailDaily() {

        const modalBackground = useRef<HTMLDivElement | null>(null);

        const handleClose = () => {
            setModalOpen(false);
        };

        if (!currentEvent) return null; // 이벤트가 없으면 null 반환
        return (
            <div className='modal-container' ref={modalBackground} onClick={e => {
                if (e.target === modalBackground.current) {
                    setModalOpen(false);
                }
            }}>
                <div className="event-form">
                    <h2>일정 설명</h2>
                    <div className="form-group">
                        <label>일정 제목:</label>
                        <div>{currentEvent.title}</div>
                    </div>
                    <div className="form-group">
                        <label>날짜:</label>
                        <div className="date-group">
                            {currentEvent.start && (
                                <div>
                                    {currentEvent.start.toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        weekday: 'long' // 요일 추가
                                    })} {currentEvent.start.toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false // 24시간 형식
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>링크:</label>
                        <div>{currentEvent.extendedProps.location}</div>
                    </div>
                    <div className="form-group">
                        <label>일정 설명:</label>
                        <div>{currentEvent.extendedProps.description}</div>
                    </div>
                    <div className="button-group">
                        <button onClick={handleClose}>닫기</button>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div id='main-calendar'>
            <WriteDaily />
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick}
                eventContent={(info) => {
                    let timeString = '';
                    if (info.event.start) { // start가 null이 아닐 때만 처리
                        timeString = info.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    }
                    return (
                        <div className='event-title'>
                            <span>{timeString}</span> {info.event.title}
                        </div>
                    );
                }}
                dayMaxEvents={2} // 최대 이벤트 수 설정
            />
            {modalOpen && <DetailDaily />}
        </div>
    );
}
