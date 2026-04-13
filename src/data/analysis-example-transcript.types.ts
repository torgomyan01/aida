export type AnalysisExampleTranscriptRole = 'operator' | 'client';

export type AnalysisExampleTranscriptLine = {
  role: AnalysisExampleTranscriptRole;
  label: string;
  text: string;
};

export type AnalysisExampleTranscriptDialog = {
  title: string;
  lines: AnalysisExampleTranscriptLine[];
};
