import React from 'react';
import { Text } from 'ink';

type Props = {
	port: number | undefined;
};

export default function App({ port = 9222 }: Props) {
	return (
		<Text>
			Hello, <Text color="green">{port}</Text>
		</Text>
	);
}
