import React from "react"

export default function Header(props) {
    return (
        <div className="cat-header-container">
            <div className="seperator"></div>
            <p className="category-title">{props.title}</p>
            <div className="seperator"></div>
        </div>
    )
}