
import { FC } from "react";
import { UpcScan, PencilSquare, Trash } from 'react-bootstrap-icons';
import { Contract } from "ethers";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType,
    setFormEditView: Function,
    setItem: Function,
    setIsModalVisible: Function,
    setIsDeleteModalVisible: Function,
    vault: Contract | null
}
const DebitCard: FC<Props> = ({item, setFormEditView, setItem, setIsModalVisible, setIsDeleteModalVisible, vault}) => {

    const handleEdit = ()=>{
        setItem(item);
        setFormEditView();
    }

    const handleOpen = ()=>{
        setItem(item);
        setIsModalVisible(true);
    }

    const handleDelete = ()=>{
        setItem(item);
        setIsDeleteModalVisible(true);
    }

    return (
        <>
            <div className={"item-card loyality-card"}>

                <div className="item-card-body">
                    <h5 className="item-card-title">
                        {item.name}
                    </h5>
                    <span className="item-card-text">
                        {item.number}
                        <br/>
                    </span>
                    <a target={"_blank"} className={"item-card-text link-purple text-white text-decoration-none"}
                       href={`https://polygonscan.com/address/${item.address}`}>
                        <small>{item.address}</small>
                    </a>
                </div>
                <div className={"item-card-footer"}>
                    <button onClick={handleOpen} className="btn-hover btn-circle"><UpcScan/></button>
                    <button onClick={handleEdit} className="btn-hover btn-circle"><PencilSquare/></button>
                    <button onClick={handleDelete} className="btn-hover btn-circle"><Trash/></button>
                </div>

            </div>
        </>
    )
}

export default DebitCard;