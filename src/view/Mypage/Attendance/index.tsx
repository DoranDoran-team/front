import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import './style.css';
import { useNavigate } from 'react-router-dom';
import MypageSidebar from '../../../components/mypage/sidebar';
import { checkAttendanceRequest, getAttendanceRecordsRequest } from '../../../apis';

export default function Attendance() {
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [cookies] = useCookies();
  const accessToken = cookies['accessToken'];
  const navigate = useNavigate();

  // 출석체크 상태 조회 API 호출 (GET)
  const fetchAttendanceRecords = async () => {
    if (!accessToken) return;
    const data = await getAttendanceRecordsRequest(accessToken);
    if (data && Array.isArray(data)) {
      // data는 AttendEntity 배열, attendAt가 YYYY-MM-DD 형식으로 저장됨
      setAttendanceDates(data.map((record: any) => record.attendAt));
      // FullCalendar에 반영할 이벤트 생성
      const newEvents = data.map((record: any) => ({
        title: "",
        start: record.attendAt,
        allDay: true,
        display: 'background'
      }));
      setEvents(newEvents);
    }
  };

  // 출석체크 버튼 클릭 시
  const handleAttendance = async () => {
    const today = moment().format("YYYY-MM-DD");
    if (attendanceDates.includes(today)) {
      alert("이미 출석 체크되었습니다.");
      return;
    }
    const response = await checkAttendanceRequest(accessToken);
    if (response && response.code === "SU") {
      alert("출석 체크 완료! 20p가 지급되었습니다.");
      // 출석체크 후 다시 출석 상태 조회하여 달력 업데이트
      fetchAttendanceRecords();
    } else {
      alert(response?.message || "출석 체크 실패");
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAttendanceRecords();
    }
  }, [accessToken]);

  return (
    <div className='mypage-wrapper'>
      <MypageSidebar />
      <div className='mypage-attendance-wrapper'>
        <div id='main-calendar'>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={(info) => (
              <div className="attendance-event">
                <div className='attendance-check' />
              </div>
            )}
            eventDidMount={(info) => {
              info.el.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              info.el.style.border = 'none';
              info.el.style.backgroundImage = `url(/public/mypage/attendance.png)`;
            }}
          />
          <button onClick={handleAttendance}>출석체크</button>
        </div>
      </div>
    </div>
  );
}
