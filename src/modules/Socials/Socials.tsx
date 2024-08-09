import Link from "next/link";
import {Github, Reddit, Telegram, Twitter} from "react-bootstrap-icons";
import {FC} from "react";

const Socials: FC = () => {
    return (
        <div>
            <Link href="/" target="_blank" className="px-2">
                <Reddit className="text-white" size={20}/>
            </Link>
            <Link href="/" target="_blank" className="px-2">
                <Twitter className="text-white" size={20}/>
            </Link>
            <Link href="/" target="_blank" className="px-2">
                <Telegram className="text-white" size={20}/>
            </Link>
            <Link href="/" target="_blank" className="px-2">
                <Github className="text-white" size={20}/>
            </Link>
        </div>
    )
}

export default Socials;