"use client"

import React, { FC } from "react";
import PageUp from "@/common/layout/PageUp";
import Header from "@/common/layout/header/Header";
import Footer from "@/common/layout/footer/Footer";
import { MemoryRouter } from "react-router-dom";

type Props = {
    children: React.ReactNode
}
const MainLayout: FC<Props> = ({children}) => {

    return(
        <>
            <MemoryRouter>
                <section className="container main-container">
                    <Header/>
                    {children}
                </section>
                <PageUp/>
                {/*<Footer/>*/}
            </MemoryRouter>
        </>
    )
}

export default MainLayout;