import { FC } from "react";
import QRCode from "react-qr-code";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null,
    isBarcodeView: boolean
}
const Body : FC<Props> = ({ item, isBarcodeView }) => {

    return (
        <>
            <div className={"loyal-card"}>
                {
                    isBarcodeView ?
                        <>
                            <h1 className={"text-barcode text-white"}>
                                {item ? item.number : ""}
                            </h1>
                        </> :
                        <>
                            <QRCode
                                size={256}
                                bgColor={"white"}
                                fgColor={"transparent"}
                                style={{ height: "auto", maxWidth: "15rem", width: "15rem" }}
                                value={item ? item.number : ""}
                                viewBox={`0 0 250 250`}
                            />
                            <span>
                                {item ? item.number : ""}
                            </span>
                        </>
                }
            </div>
        </>
    )
}

export default Body;