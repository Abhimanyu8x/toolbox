import { allTools } from './tools';

export const toolKeywords: Record<string, string> = allTools.reduce((acc, tool) => {
  acc[tool.path] = tool.keywords;
  return acc;
}, {} as Record<string, string>);

export default toolKeywords;
