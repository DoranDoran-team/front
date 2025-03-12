import React, { useEffect, useState } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import { SearchUserData } from "../../apis/dto/response/user/get-search-user-list.response.dto";
import { searchUsersRequest } from "../../apis";

interface MentionInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function MentionInput({ value, onChange }: MentionInputProps) {
    const [cookies] = useCookies();
    const accessToken = cookies["accessToken"];

    const [mentionQuery, setMentionQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<SearchUserData[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    // 마지막 "@" 뒤의 텍스트를 추출 (띄어쓰기 없이 입력한 경우)
    const extractMentionQuery = (text: string): string => {
        const match = text.match(/@(\S*)$/);
        return match ? match[1] : "";
    };

    useEffect(() => {
        const query = extractMentionQuery(value);
        setMentionQuery(query);
        if (query.length > 0) {
            performSearch(query);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    }, [value]);

    const performSearch = async (keyword: string) => {
        if (!keyword.trim()) {
            setShowSuggestions(false);
            setSuggestions([]);
            return;
        }
        if (!accessToken) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }
        const response = await searchUsersRequest(keyword, accessToken);
        if (!response || response.code !== "SU" || !("userList" in response)) {
            setSuggestions([]);
            setShowSuggestions(true);
            return;
        }
        // 백엔드가 userList에 userId와 nickName 모두를 포함하여 검색 결과를 리턴해야 함
        setSuggestions(response.userList);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (user: SearchUserData) => {
        // 현재 입력값에서 마지막 '@'와 그 뒤의 문자열을 제거하고 선택된 닉네임으로 대체 후, 뒤에 공백 추가
        const newValue = value.replace(/@(\S*)$/, "") + "@" + user.nickName + " ";
        onChange(newValue);
        setShowSuggestions(false);
    };

    return (
        <div className="mention-input-container">
            <textarea
                className="input-comment-text"
                placeholder="댓글을 입력해주세요."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="mention-dropdown">
                    <div className="mention-dropdown-close" onClick={() => setShowSuggestions(false)}>
                        닫기
                    </div>
                    {suggestions.map((user) => (
                        <div className="mention-suggestion" key={user.userId} onClick={() => handleSuggestionClick(user)}>
                            <div
                                className="mention-suggestion-image"
                                style={{ backgroundImage: `url(${user.profileImage || ""})` }}
                            ></div>
                            <div className="mention-suggestion-text">
                                <div className="mention-suggestion-nickname">{user.nickName}</div>
                                <div className="mention-suggestion-userId">@{user.userId}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
