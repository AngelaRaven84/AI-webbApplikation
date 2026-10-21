import { Link } from 'react-router-dom';
import './index.css';

export const LandingPromo = () => {
    const PROMO_IMG = 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&h=600&fit=crop&auto=format';

    return (
        <section className="landing-promo wrapper">
            <div
                className="landing-promo__bg"
                style={{ backgroundImage: `url(${PROMO_IMG})` }}
            />

            <div className="landing-promo__content">
                <p className="landing-promo__eyebrow">
                    Configure yours
                </p>

                <h2 className="landing-promo__title">
                    Build your
                    <br />
                    ultimate setup.
                </h2>

                <p className="landing-promo__description">
                    Every PixelForge PC is assembled to order in Stockholm.
                    Choose your components, let us build it.
                </p>

                <Link
                    className="landing-promo__link"
                    to="/products"
                >
                    Explore gaming PCs
                </Link>
            </div>
        </section>
    );
};