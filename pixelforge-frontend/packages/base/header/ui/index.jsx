import { Brand } from '@pixelforge/brand';
import { NavBar } from '@pixelforge/navbar';
import { HeaderActions } from '@pixelforge/headeractions';
import './index.css';

export const Header = () => {
    return (
        <header className="header">
            <div className="wrapper header__wrapper">
                <Brand />
                <NavBar />
                <HeaderActions />
            </div>
        </header>
    )
}
