import React from 'react';

type TestReportViewerProps = {
    report: string;
};

export const TestReportViewer: React.FC<TestReportViewerProps> = ({ report }) => (
    <pre>{report}</pre>
);
