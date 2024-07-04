import { useWebSocket } from "@/hooks/useWebSocket";
import { FileNode } from "@/utils/socketEventInterface";
import React, { useState } from "react";

interface FileExplorerProps {
    initialTree: FileNode[] | null;
    isOpen: boolean;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ initialTree, isOpen }) => {
    const { socket } = useWebSocket();
    const [tree, setTree] = useState<FileNode[] | null>(initialTree);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggleNode = (name: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(name)) {
            newExpanded.delete(name);
        } else {
            newExpanded.add(name);
        }
        setExpanded(newExpanded);
    };

    const sendFileEvent = (action: string, filePath: string, isDir: boolean) => {
		if(!socket) return;
        socket.send(
            JSON.stringify({
                event: "file",
                action,
                filePath,
                isDir,
            })
        );
    };

    const updateTree = (nodes: FileNode[], path: string[], name: string, isDir: boolean) => {
        if (path.length === 0) {
            nodes.push({ name, children: isDir ? [] : undefined });
            return;
        }

        for (const node of nodes) {
            if (node.name === path[0]) {
                if (node.children) {
                    updateTree(node.children, path.slice(1), name, isDir);
                }
                break;
            }
        }
    };

    const createNode = (path: string, name: string, isDir: boolean) => {
        const pathArray = path.split('/').filter(Boolean);
        const newTree = [...(tree || [])];
        updateTree(newTree, pathArray, name, isDir);
        setTree(newTree);
        sendFileEvent("create", `${path}/${name}`, isDir);
    };

    const deleteNodeFromTree = (nodes: FileNode[], path: string[]) => {
        if (path.length === 1) {
            const index = nodes.findIndex(node => node.name === path[0]);
            if (index !== -1) nodes.splice(index, 1);
            return;
        }

        for (const node of nodes) {
            if (node.name === path[0] && node.children) {
                deleteNodeFromTree(node.children, path.slice(1));
                break;
            }
        }
    };

    const deleteNode = (path: string, name: string, isDir: boolean) => {
        const pathArray = path.split('/').filter(Boolean);
        const newTree = [...(tree || [])];
        deleteNodeFromTree(newTree, [...pathArray, name]);
        setTree(newTree);
        sendFileEvent("delete", `${path}/${name}`, isDir);
    };

    const renderTree = (nodes: FileNode[] | null, parentPath: string = "") => {
        if (!nodes) {
            return <>Files not loaded</>;
        }

        return nodes.map((node) => {
            const currentPath = `${parentPath}/${node.name}`;
            return (
                <div key={node.name} className="ml-4">
                    <div
                        className="flex items-center cursor-pointer hover:bg-gray-600 p-1"
                        onClick={() => node.children && toggleNode(node.name)}
                    >
                        {node.children && (
                            <span className="mr-2">
                                {expanded.has(node.name) ? "📂" : "📁"}
                            </span>
                        )}
                        {node.name}
                        {node.children && (
                            <div className="ml-2 flex space-x-2">
                                <button onClick={(e) => {e.stopPropagation(); createNode(currentPath, "new-folder", true);}}>
                                    Add Folder
                                </button>
                                <button onClick={(e) => {e.stopPropagation(); createNode(currentPath, "new-file.txt", false);}}>
                                    Add File
                                </button>
                            </div>
                        )}
                        <button className="ml-2" onClick={(e) => {e.stopPropagation(); deleteNode(parentPath, node.name, !!node.children);}}>
                            Delete
                        </button>
                    </div>
                    {expanded.has(node.name) && node.children && (
                        <div className="pl-4 border-l border-gray-500">
                            {renderTree(node.children, currentPath)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div
            className={`h-full bg-explorer-dark transition-transform ${
                isOpen ? "transform translate-x-0" : "transform -translate-x-full"
            }`}
            style={{ width: "250px" }}
        >
            {renderTree(tree)}
        </div>
    );
};

export default FileExplorer;
