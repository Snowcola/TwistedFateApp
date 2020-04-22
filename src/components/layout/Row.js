import React, { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'

export default function HRow({ children, align }) {
    const [position, setPosition] = useState("center")

    useEffect(() => {
        if (align) {
            console.log("Align")
            setPosition(align)
        }
    }, [])

    return (
        <Row style={{ justifyContent: `${position}` }}>
            {children}
        </Row>
    )
}