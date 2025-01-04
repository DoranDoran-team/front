import { Outlet } from 'react-router';
import './style.css';

// component: 로고 컴포넌트 //
function Logo() {

    // render: 로고 컴포넌트 렌더링 //
    return (
        <div id='layout-logo'>
            <div className='box'>
                <div className='title'>도란도란</div>
                <div className='icon'></div>
            </div>
        </div>
    );

}

// component: 메인 레이아웃 컴포넌트 //
export default function MainLayout() {
    // render: 메인 레이아웃 컴포넌트 렌더링 //
    return (
        <div id='main-layout'>
            <Logo />
            {/* <Top />
                <SideNavigation /> */}
            <div id='main-wrapper'>
                <Outlet />
            </div>
        </div>
    );
}