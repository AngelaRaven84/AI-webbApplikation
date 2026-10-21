import './index.css';

export const Footer = () => {
    return (
        <footer className="footer wrapper">
            <div className="footer__main">

                <nav className="footer__column" aria-label="Customer service">
                    <h2>Customer Service</h2>
                    <ul>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/order-tracking">Order Tracking</a></li>
                        <li><a href="/returns">Returns & Refunds</a></li>
                        <li><a href="/warranty">Warranty Claims</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </nav>

                <nav className="footer__column" aria-label="Shopping">
                    <h2>Shopping</h2>
                    <ul>
                        <li><a href="/products">All Products</a></li>
                        <li><a href="/gaming-pcs">Gaming PCs</a></li>
                        <li><a href="/components">Components</a></li>
                        <li><a href="/monitors">Monitors</a></li>
                        <li><a href="/peripherals">Peripherals</a></li>
                        <li><a href="/deals">Deals</a></li>
                    </ul>
                </nav>

                <nav className="footer__column" aria-label="About PixelForge">
                    <h2>About PixelForge</h2>
                    <ul>
                        <li><a href="/about">Our Story</a></li>
                        <li><a href="/sustainability">Sustainability</a></li>
                        <li><a href="/press">Press</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/partners">Partner Program</a></li>
                    </ul>
                </nav>

                <section className="footer__column footer__contact">
                    <h2>Contact</h2>

                    <address>
                        PixelForge AB
                        <br />
                        Drottninggatan 42
                        <br />
                        111 51 Stockholm
                    </address>

                    <div className="footer__contact-details">
                        <a href="mailto:support@pixelforge.se">
                            support@pixelforge.se
                        </a>
                        <a href="tel:0812345678">
                            08-123 456 78
                        </a>
                    </div>

                    <p className="footer__hours">Mon–Fri 9:00–18:00</p>
                </section>
            </div>

            <div className="footer__bottom">
                <div className="footer__payments">
                    <span>Accepted payments:</span>

                    <ul aria-label="Accepted payment methods">
                        <li>Visa</li>
                        <li>MC</li>
                        <li>Swish</li>
                        <li>Klarna</li>
                        <li>PayPal</li>
                    </ul>
                </div>

                <small className="footer__copyright">
                    © 2026 PixelForge AB. All rights reserved. Org.nr. 556789-1234
                </small>
            </div>
        </footer>
    );
};