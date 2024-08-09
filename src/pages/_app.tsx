import { AppProps } from 'next/app'

import '../styles/globals.css'
import '../styles/Header.css'
import '../styles/MainLayout.css'
import '../styles/Footer.css'

import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect} from "react";

export default function App({ Component, pageProps }: AppProps) {

    // useEffect(() => {
    //     window.addEventListener('scroll', (evt ) => {
    //
    //         if(window.scrollY > 50) {
    //             document.querySelector('header')?.classList.add('sticky');
    //         }else {
    //             document.querySelector('header')?.classList.remove('sticky');
    //         }
    //
    //     })
    // }, []);

    return <Component style={{minHeight: "100vh"}} {...pageProps} />
}