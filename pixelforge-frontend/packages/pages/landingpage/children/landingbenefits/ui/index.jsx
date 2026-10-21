import './index.css';
import { Truck, Clock, ShieldCheck, UserRound } from 'lucide-react';
import { Icon } from '@pixelforge/icon';

export const LandingBenefits = () => {
    return (
        <section className="landing-benefits" aria-label="Shopping benefits">
            <div className="landing-benefits__container wrapper">

                <article className="landing-benefits__item">
                    <div className="landing-benefits__icon">
                        <Icon icon={Truck} size={20} />
                    </div>
                    <div className="landing-benefits__content">
                        <h3>Fast Delivery</h3>
                        <p>
                            Free shipping on orders over 999 SEK.
                            Express delivery available.
                        </p>
                    </div>
                </article>

                <article className="landing-benefits__item">
                    <div className="landing-benefits__icon">
                        <Icon icon={Clock} size={20} />
                    </div>
                    <div className="landing-benefits__content">
                        <h3>30-Day Returns</h3>
                        <p>
                            Not happy? Return any product within
                            30 days, no questions asked.
                        </p>
                    </div>
                </article>

                <article className="landing-benefits__item">
                    <div className="landing-benefits__icon">
                        <Icon icon={ShieldCheck} size={20} />
                    </div>
                    <div className="landing-benefits__content">
                        <h3>Secure Payments</h3>
                        <p>
                            Fully encrypted checkout with your
                            preferred payment method.
                        </p>
                    </div>
                </article>

                <article className="landing-benefits__item">
                    <div className="landing-benefits__icon">
                        <Icon icon={UserRound} size={20} />
                    </div>
                    <div className="landing-benefits__content">
                        <h3>Swedish Support</h3>
                        <p>
                            Local customer service team available
                            Monday to Friday.
                        </p>
                    </div>
                </article>

            </div>
        </section>
    );
};