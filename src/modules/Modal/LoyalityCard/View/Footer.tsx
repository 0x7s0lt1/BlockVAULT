import { FC } from "react";
import Form from 'react-bootstrap/Form';
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null,
    isBarcodeView: boolean,
    setIsBarcodeView: Function
}
const Footer : FC<Props> = ({ item, isBarcodeView, setIsBarcodeView }) => {

    const handleViewChange = (event: any) => {
        setIsBarcodeView(event.target.checked);
    }

    return (
        <>
            <Form.Check // prettier-ignore
                type="switch"
                checked={isBarcodeView}
                className="loy-view-switch"
                onChange={handleViewChange}
            />
            <span>
                QR / BAR
            </span>
        </>
    )
}

export default Footer;