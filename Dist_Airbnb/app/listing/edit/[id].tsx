
import React from 'react';

type Props = { params?: { id?: string } };

export default function EditListing({ params }: Props) {
	const id = params?.id ?? 'unknown';
	return (
		<div style={{padding: 24, textAlign: 'center'}}>
			<h1>Edit Listing</h1>
			<p>Coming soon... (id: {id})</p>
		</div>
	);
}
