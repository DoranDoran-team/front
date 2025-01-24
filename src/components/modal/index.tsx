
import './style.css';
// interface: modal Props
interface modalProps {
    content: string
    lt_btn: string
    rt_btn: string
    handler: ()=>void
}
export default function Modal({content, lt_btn, rt_btn, handler}: modalProps) {
    
    return (
        <div>
            <div className='modal-wrapper'>
                <div className='modal-box'>
                    <div className='modal-content'>{content}</div>
                    <div className='modal-button-box'>
                        <div className='modal-button'>{rt_btn}</div>
                        <div className='modal-button' onClick={handler}>{lt_btn}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
