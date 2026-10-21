import { Layout } from "@pixelforge/layout";
import { LandingPage } from "@pixelforge/landingpage";
import { ProductPage } from '@pixelforge/productpage';
import { SupportPage } from "@pixelforge/supportpage";
import { SingleDocumentPage } from "@pixelforge/singledocumentpage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path : '/',
        element : <Layout />,
        children : [
            {
                index : true,
                element : <LandingPage />
            },
            {
                path : 'products',
                element : <ProductPage />
            },
            {
                path : 'support',
                element : <SupportPage />
            },
            {
                path : 'support/:slug',
                element : <SingleDocumentPage />
            },
        ]
    }
]);