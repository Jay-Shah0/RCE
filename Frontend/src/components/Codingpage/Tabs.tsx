import React, { useEffect, useState } from 'react'
import TerminalCompnent from './Tabs/Terminal';
import { SocketMessage } from '@/utils/socketEventInterface';

const Tabs: React.FC<{ data: SocketMessage | null}> = ({ data }) => {

	const [termData, setTermData] = useState<string>("")

	useEffect(() => {
		if(data){
			if(data.event === "term"){
				setTermData(data.output)
			}
		}
	}, [data])
	

	return (
		<div className="w-full h-full">
			<TerminalCompnent termId="1" data={termData} />
		</div>
	);
};

export default Tabs