import Head from "next/head";
import {FC, useEffect} from "react";

type Props = {
    title?: string;
    description?: string;
    favIcon?: string;
    themeColor?: string;
    ogUrl?: string;
    ogType?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
}
const Meta : FC<Props> = ({
                            title = "BlockVault",
                            description = "OnChain password manager",
                            favIcon = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔑</text></svg>",
                            themeColor = "#000000",
                            ogUrl = "OnChain password manager",
                            ogType = "website",
                            ogTitle = "BlockVault",
                            ogDescription = "OnChain password manager",
                            ogImage = "https://images.unsplash.com/photo-1651955784685-f969100bfc25",
                          }) => {

    useEffect(() => {

        // MS CLARITY
        // @ts-ignore
        (function(c,l,a,r,i,t,y){
            // @ts-ignore
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            // @ts-ignore
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            // @ts-ignore
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            // @ts-ignore
        })(window, document, "clarity", "script", "no425d9h3o");

        // GOOGLE ANALYTICS
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        function gtag(){dataLayer.push(arguments);}
        // @ts-ignore
        gtag('js', new Date());

        // @ts-ignore
        gtag('config', 'G-MQ9R21RBCN');

    },[]);

    // @ts-ignore
    return (
        <Head>

            <title>{title}</title>
            <meta name="description" content={description}/>
            <link rel="icon" type="image/png" href={favIcon}/>
            <meta name="theme-color" content={themeColor}/>


            <meta property="og:url" content={ogUrl}/>
            <meta property="og:type" content={ogType}/>
            <meta property="og:title" content={ogTitle}/>
            <meta property="og:description" content={ogDescription}/>
            <meta property="og:image" content={ogImage}/>

            <script async src="https://www.googletagmanager.com/gtag/js?id=G-MQ9R21RBCN"></script>

        </Head>
    )
}

export default Meta;