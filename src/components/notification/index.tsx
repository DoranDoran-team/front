import React, { useEffect, useState } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { getNotifications, markNotificationAsRead } from "../../apis";
import moment from "moment";
import { GetNotificationsResponseDto } from "../../apis/dto/response/notification/get-notifications.reponse.dto";

export default function Notification() {
    const [cookies] = useCookies();
    const accessToken = cookies.accessToken;
    const [notifications, setNotifications] = useState<GetNotificationsResponseDto[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    // 알림 데이터 가져오기 (중복 제거)
    useEffect(() => {
        if (!accessToken) return;

        async function fetchNotifications() {
            const data = await getNotifications(accessToken, page);
            if (data && data.length > 0) {
                setNotifications((prev) => {
                    const mergedNotifications = [...prev, ...data];
                    const uniqueNotifications = mergedNotifications.reduce((acc, curr) => {
                        if (!acc.find((item: { notificationId: any; }) => item.notificationId === curr.notificationId)) {
                            acc.push(curr);
                        }
                        return acc;
                    }, [] as GetNotificationsResponseDto[]);
                    return uniqueNotifications;
                });
            } else {
                setHasMore(false); // 더 이상 데이터가 없으면 버튼 숨김
            }
            setLoading(false);
        }

        fetchNotifications();
    }, [accessToken, page]);

    // 알림 클릭 시 처리 (읽음 처리 + 페이지 이동)
    const handleNotificationClick = async (notification: GetNotificationsResponseDto) => {
        if (!accessToken) return;

        if (!notification.isRead) {
            await markNotificationAsRead(notification.notificationId, accessToken);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notificationId === notification.notificationId ? { ...n, isRead: true } : n
                )
            );
        }

        if (["MILEAGE_EARNED", "REFUND_APPROVED", "REFUND_DENIED"].includes(notification.notificationType)) {
            navigate("/mypage/mileage");
        }
    };

    // 알림 시간 표시 (n초 전, n분 전, n시간 전, n일 전)
    const formatNotificationDate = (dateString: string) => {
        const notificationDate = moment(dateString);
        const now = moment();

        const diffInSeconds = now.diff(notificationDate, "seconds");
        const diffInMinutes = now.diff(notificationDate, "minutes");
        const diffInHours = now.diff(notificationDate, "hours");
        const diffInDays = now.diff(notificationDate, "days");

        if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
        if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
        if (diffInHours < 24) return `${diffInHours}시간 전`;
        if (diffInDays < 10) return `${diffInDays}일 전`;

        return notificationDate.format("YYYY.MM.DD");
    };

    return (
        <div className="notification-container">
            <h3>알림</h3>
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <div className="notification-list">
                    {notifications.slice(0, 5).map((notification) => (
                        <div
                            key={notification.notificationId}
                            className={`notification-item ${notification.isRead ? "read" : ""}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <p>{notification.message}</p>
                            <span className="notification-time">{formatNotificationDate(notification.notificationDate)}</span>
                        </div>
                    ))}
                </div>
            )}
            {hasMore && (
                <button onClick={() => setPage((prev) => prev + 1)} className="load-more">
                    더보기
                </button>
            )}
        </div>
    );
}
