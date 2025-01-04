import React, { useRef, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';

// GD: general discussion
// component: 일반 토론방 컴포넌트 //
export default function GD() {

    // function: 네비게이터 함수 //
    // const navigator = useNavigate();

    return (
        <div id="gd-wrapper">
            <div className='gd-box'>
                <div className="top">
                    <h1 className="top-title">
                        시사·교양
                    </h1>
                    <div className='top-category-box'>
                        <div className='top-categoty'>시사·교양</div>
                        <div className='top-categoty'>과학</div>
                        <div className='top-categoty'>경제</div>
                        <div className='top-categoty'>경제</div>
                        <div className='top-categoty'>기타</div>
                    </div>
                </div>
                <div className="main">
                    <div className='main-box'>
                        <div className="box1">
                            <div className='profile-image'>image</div>
                            <div className='user-nickname'>닉네임</div>
                        </div>
                        <div className="box2">
                            <div className='discussion-image'>
                                <img src=''></img>
                            </div>
                            <div className=''></div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}