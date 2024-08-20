import {FC} from "react";
import { CupHotFill, Github } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const Footer: FC = () => {
    return (
        <footer className="footer container">

            <section className={"container shadow footer-inner"}>

                <div>
                    <Link target={"_blank"} to={"https://github.com/0x7s0lt1/BlockVAULT"} className={"text-white fsr-1 mx-2"}>
                        <Github/>
                    </Link>

                    <Link target={"_blank"} to={"https://github.com/0x7s0lt1/BlockVAULT"} className={"text-white fsr-1 mx-2"}>
                        <CupHotFill/>
                    </Link>
                </div>

            </section>

        </footer>
    )
}

export default Footer;