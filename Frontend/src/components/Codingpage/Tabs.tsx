import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import TerminalComponent from './Tabs/Terminal';
import { SocketMessage } from '@/utils/socketEventInterface';

interface TabData {
  id: number;
  type: 'terminal';
}

const Tabs: React.FC<{ data: SocketMessage | null }> = ({ data }) => {
  const [tabs, setTabs] = useState<TabData[]>([{ id: 1, type: 'terminal' }]);
  const [termData, setTermData] = useState<Record<number, string>>({ 1: "" });

  useEffect(() => {
    if (data && data.event === 'term') {
      setTermData(prevData => ({
        ...prevData,
        [data.id]: data.output
      }));
    }
  }, [data]);

  const addNewTab = () => {
    const newId = tabs.length + 1;
    setTabs([...tabs, { id: newId, type: 'terminal' }]);
    setTermData(prevData => ({
      ...prevData,
      [newId]: ""
    }));
  };

  return (
    <div className="w-full h-full">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-lg">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg
                  ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              Terminal {tab.id}
            </Tab>
          ))}
          <button
            onClick={addNewTab}
            className="w-10 h-10 text-xl font-bold text-blue-700 bg-blue-200 rounded-full hover:bg-blue-300"
          >
            +
          </button>
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.id} className="p-3 bg-white rounded-lg shadow">
              <TerminalComponent termId={tab.id.toString()} data={termData[tab.id] || ""} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
