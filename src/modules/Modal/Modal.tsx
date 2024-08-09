import React, {FC, useEffect, useState, useRef} from "react";
import { X } from 'react-bootstrap-icons';

type Props = {
    visible: boolean,
    setVisible: Function,
    closeable?: boolean,
    header?: any,
    body?: any,
    footer?: any,
    onClose?: Function,
    onConfirm?: Function
}
const Modal : FC<Props> = ({
                               visible,
                               setVisible,
                               closeable = true,
                               header,
                               body,
                               footer,
                               onClose,
                               onConfirm
                           }) => {

    const ref = useRef();
    const close = () => {
        if(typeof onClose == "function") onClose();
        setVisible(false);
    }

    useEffect(() => {
        if(visible) {
            ref.current?.showModal();
        }else {
            ref.current?.close();
        }
    }, [visible]);

    return (
        <>
            <dialog ref={ref}  >
                <section className={"dialog-inner"}>
                    <div className={"dialog-header"}>
                        <div className={"dialog-title"}>
                            {header}
                        </div>
                        {
                            closeable ?
                                <div className={"dialog-close-wrapper"}>
                                    <X className={"dialog-close-btn"} size={26} onClick={close}/>
                                </div> :
                                <></>
                        }
                    </div>
                    <div className={"modal-body"}>
                        {body}
                    </div>
                    <div className={"modal-footer"}>
                        {footer}
                    </div>
                </section>
            </dialog>
        </>
    )
}

export default Modal;