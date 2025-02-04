import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState } from 'react';
import { EventInput } from '@fullcalendar/core';
import './style.css'; // CSS 파일

export default function Attendance() {
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);

  const handleAttendance = () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식

    if (attendanceDates.includes(today)) {
      alert("이미 출석 체크되었습니다.");
      return;
    }

    // 출석 날짜 저장
    setAttendanceDates([...attendanceDates, today]);

    // 이벤트 상태 업데이트
    setEvents((prev) => [
      ...prev,
      {
        title: "", // 제목을 비워두고 이미지로만 표시
        start: today,
        allDay: true,
        // extendedProps: {
        //   url: '/public/mypage/attendance.png', // 표시할 이미지 URL
        // },
        display: 'background'
      },
    ]);
  };

  return (
    <div className='mypage-wrapper'>
      <div className='mypage-attendance-wrapper'>
        <button onClick={handleAttendance}>출석체크</button>
        <div id='main-calendar'>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={(info) => {
              return (
                <div className="attendance-event">
                  <div className='attendance-check' />
                </div>
              );
            }}
            eventDidMount={(info) => {
              // 이미지가 있는 이벤트에 스타일 적용
              info.el.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // 배경색
              info.el.style.border = 'none'; // 기본 테두리 제거
              info.el.style.backgroundImage = `url(/public/mypage/attendance.png)`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
