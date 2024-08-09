
import { FC } from "react";


const ConnectWallet : FC = () => {

    return (
        <>
            <section className="crt-vlt-wrapper">
                <div className="card">
                    <p className="card-text">
                        Please connect your wallet and choose Polygon Mainnet.
                    </p>
                    <w3m-button balance="hide" size="md"/>
                </div>
            </section>
        </>
    )
}

export default ConnectWallet;