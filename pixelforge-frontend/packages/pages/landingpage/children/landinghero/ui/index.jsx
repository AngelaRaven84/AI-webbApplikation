import { Button } from '@pixelforge/button';
import './index.css';

export const LandingHero = () => {
    const HERO_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop&auto=format';


    return (
        <section className="landing-hero">
            <section 
                className="landing-hero__bg"
                style={{ backgroundImage : `url(${HERO_IMG})` }}
            ></section>
            <section className="landing-hero__content wrapper">
                <span className="landing-hero__badge">
                    New arrivals for autumn 2026
                </span>

                <h1 className="landing-hero__title">
                    Upgrade<br />
                    your game.
                </h1>

                <p className="landing-hero__description">
                    Premium gaming hardware curated by enthusiasts.
                    <br />
                    From custom-built PCs to the peripherals that pro
                    <br />
                    players trust.
                </p>

                <section className="landing-hero__actions">
                    <Button 
                        text="Shop products"
                        type="regular"
                        onClick={ () => console.log('Shop shop') }
                    />

                    <Button 
                        text="Explore gaming PCs"
                        type="outline"
                        onClick={ () => console.log('Explore') }
                    />
                </section>
            </section>
        </section>
    )
}
