export const compareTimes = (discussionEnd: string) => {
    
    // 현재 시간
    const currentTime = new Date();

    // 비교할 날짜 문자열
    const targetDate = new Date(discussionEnd); // 문자열로 받은 날짜는 자동으로 Date 객체로 변환됩니다.

    // 시간을 00:00:00으로 초기화하여 날짜만 비교
    targetDate.setHours(0, 0, 0, 0); 
    currentTime.setHours(0, 0, 0, 0); 

    if (currentTime < targetDate) {
        // 현재 시간이 목표 시간보다 이전 = 진행 중
        return true;
    } else {
        // 현재 시간이 목표 시간보다 이후 = 마감
        return false;
    }
};