import { LandingHero } from '@pixelforge/landinghero';
import { LandingCategories } from '@pixelforge/landingcategories';
import { LandingFeaturedProducts } from '@pixelforge/landingfeaturedproducts';
import { LandingPromo } from '@pixelforge/landingpromo';
import { LandingPopularProducts } from '@pixelforge/landingpopularproducts';
import { LandingBenefits } from '@pixelforge/landingbenefits';

import './index.css';

export const LandingPage = () => {
    return (
        <>
            <LandingHero />
            <LandingCategories />
            <LandingFeaturedProducts />
            <LandingPromo />
            <LandingPopularProducts />
            <LandingBenefits />
        </>
    )
}
