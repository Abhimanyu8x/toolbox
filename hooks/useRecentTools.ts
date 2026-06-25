import { useState, useEffect } from 'react';
import { Tool, allTools } from '../data/tools';

const RECENT_TOOLS_KEY = 'toolbox_recent_tools';
const MAX_RECENT_TOOLS = 4;

export const useRecentTools = () => {
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    // Load from local storage on mount
    const stored = localStorage.getItem(RECENT_TOOLS_KEY);
    if (stored) {
      try {
        const parsedPaths = JSON.parse(stored) as string[];
        // Map paths back to full tool objects
        const tools = parsedPaths
          .map(path => allTools.find(t => t.path === path))
          .filter((t): t is Tool => t !== undefined);
        setRecentTools(tools);
      } catch (e) {
        console.error('Failed to parse recent tools', e);
      }
    }
  }, []);

  const addRecentTool = (path: string) => {
    // Check if it's a valid tool path
    const tool = allTools.find(t => t.path === path);
    if (!tool) return;

    setRecentTools(prev => {
      // Remove if already exists to move it to the top
      const filtered = prev.filter(t => t.path !== path);
      const newTools = [tool, ...filtered].slice(0, MAX_RECENT_TOOLS);
      
      // Persist paths only
      const paths = newTools.map(t => t.path);
      localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(paths));
      
      return newTools;
    });
  };

  return { recentTools, addRecentTool };
};
