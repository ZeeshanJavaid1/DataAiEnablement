import React,{useContext,useEffect} from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../assets/css/Layout.css';

const Layout = ({ children }) => {
 
    return (
        <div className="layout-container" >
            <Header />
            <div className="content">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
