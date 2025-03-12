import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { deleteNotification, getNotifications, markNotificationAsRead } from "../../apis";
import { GetNotificationsResponseDto } from "../../apis/dto/response/notification/get-notifications.reponse.dto";

interface NotificationProps {
    // 미읽은 알림 존재 여부를 부모에 알려줄 콜백
    setHasUnread: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Notification({ setHasUnread }: NotificationProps) {
    const [cookies] = useCookies();
    const accessToken = cookies.accessToken;

    const [notifications, setNotifications] = useState<GetNotificationsResponseDto[]>([]);
    const [page, setPage] = useState<number>(1); // 더보기 페이지
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [displayCount, setDisplayCount] = useState<number>(5);

    const navigate = useNavigate();

    async function fetchNotifications() {
        if (!accessToken) return;
        setLoading(true);
        const data = await getNotifications(accessToken, page);
        if (data && data.length > 0) {
            setNotifications((prev) => {
                // 이전 목록과 새 데이터를 합치기
                const merged = [...prev, ...data];
                // notificationId 기준 중복 제거
                const unique = merged.reduce((acc, curr) => {
                    if (!acc.find((item: { notificationId: any }) => item.notificationId === curr.notificationId)) {
                        acc.push(curr);
                    }
                    return acc;
                }, [] as GetNotificationsResponseDto[]);
                return unique;
            });
            if (data.length < 5) {
                setHasMore(false);
            }
        } else {
            // 다음 페이지가 없으면
            setHasMore(false);
        }
        setLoading(false);
    }

    // 컴포넌트 마운트 시 한 번 알림 fetch
    useEffect(() => {
        if (accessToken) {
            fetchNotifications();
        }
    }, [accessToken]);

    // 페이지 변경 시 알림 fetch (더보기)
    useEffect(() => {
        if (page > 1 && accessToken) {
            fetchNotifications();
        }
    }, [page, accessToken]);

    // 미읽은 알림이 없으면 5초마다 폴링하여 알림 fetch
    useEffect(() => {
        if (!accessToken) return;
        if (!notifications.some((n) => !n.isRead) && hasMore) {
            const interval = setInterval(() => {
                fetchNotifications();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [accessToken, notifications, hasMore]);

    // notifications가 변경될 때마다 미읽은 알림 여부 업데이트
    useEffect(() => {
        const unreadExists = notifications.some((n) => !n.isRead);
        setHasUnread(unreadExists);
    }, [notifications, setHasUnread]);

    const handleLoadMore = () => {
        // 만약 현재 표시할 알림 개수보다 전체가 적고 추가 페이지가 있을 경우 fetch
        if (notifications.length <= displayCount && hasMore) {
            setPage(page + 1);
        }
        setDisplayCount(displayCount + 5);
    };


    // 알림 클릭 시 처리: 미읽음이면 읽음 처리 후 최신 상태 동기화, 타입별로 해당 페이지로 이동
    const handleNotificationClick = async (notification: GetNotificationsResponseDto) => {
        if (!accessToken) return;

        if (!notification.isRead) {
            await markNotificationAsRead(notification.notificationId, accessToken);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notificationId === notification.notificationId ? { ...n, isRead: true } : n
                )
            );
            // 최신 알림 동기화를 위해 fetch
            fetchNotifications();
        }

        // 알림 타입에 따라 이동 경로 결정
        switch (notification.notificationType) {
            case "MILEAGE_EARNED":
            case "REFUND_APPROVED":
            case "REFUND_DENIED":
                navigate("/mypage/mileage");
                break;
            case "NEW_REFUND_REQUEST":
                navigate("/admin/mileage");
                break;
            case "COMMENT_ON_POST":
            case "REPLY_TO_COMMENT":
            case "MENTION":
                if (notification.additionalInfo) {
                    navigate(notification.additionalInfo);
                }
                break;
            case "REPORT_RECEIVED":
                navigate("/admin/accuse");
                break;
            default:
                break;
        }
    };

    // 알림 삭제 핸들러
    const handleDeleteNotification = async (notificationId: number) => {
        if (!accessToken) return;
        const result = await deleteNotification(notificationId, cookies.accessToken);
        if (result && result.code === "SU") {
            setNotifications((prev) =>
                prev.filter((n) => n.notificationId !== notificationId)
            );
        } else {
            alert("알림 삭제에 실패했습니다.");
        }
    };

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
                    {notifications.slice(0, displayCount).map((notification) => (
                        <div
                            key={notification.notificationId}
                            className={`notification-item ${notification.isRead ? "read" : "unread"}`}
                        >
                            <div className="notification-content">
                                <p onClick={() => handleNotificationClick(notification)}>{notification.message}</p>
                                <div className="for-display-flex">
                                    <div>
                                        <span className="notification-time">
                                            {formatNotificationDate(notification.notificationDate)}
                                        </span>
                                    </div>
                                    <div>
                                        <button
                                            className="notification-delete"
                                            onClick={() => handleDeleteNotification(notification.notificationId)}
                                        >
                                            x
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {((notifications.length > displayCount) || hasMore) && !loading && (
                <button onClick={handleLoadMore} className="load-more">
                    더보기
                </button>
            )}
        </div>
    );
}
