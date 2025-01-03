import React from 'react';
import { Text } from 'ink';
export default function App({ port = 9222 }) {
    return (React.createElement(Text, null,
        "Hello, ",
        React.createElement(Text, { color: "green" }, port)));
}
