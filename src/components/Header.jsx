import React from 'react'
import '../styles/header.css'

const Header = () => {
    return (
        <div className="header">
            <div className="header-sub">
                <div className="he">Curie, your research aide!</div>
            </div>
            {/* <div className="header-sub">
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>
            </div> */}
            <div className="header-sub">
                <div className="profile">Profile</div>
            </div>
        </div>
    )
}

export default Header